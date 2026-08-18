import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appointment, RankedSafeZone, SafeZone, User } from '../types';
import { SEED_APPOINTMENTS } from '../mocks/appointments';
import { haversineDistanceKm, midpoint, sortByDistanceFrom } from '../utils/distance';
import { generateId, generateQrToken } from '../utils/id';
import { generateSafeZoneRecommendations } from '../utils/gemini';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';
import { useMatchStore } from './useMatchStore';
import { useSafeZoneStore } from './useSafeZoneStore';

const GENDER_LABEL_KO: Record<string, string> = { male: '남성', female: '여성', unspecified: '미공개' };
const TALK_STYLE_LABEL_KO: Record<string, string> = {
  quiet: '조용한 곳을 선호',
  lively: '활기찬 곳을 선호',
  'no-preference': '장소 분위기 선호 없음',
};

function talkStyleSummary(userA: User, userB: User): string {
  const a = TALK_STYLE_LABEL_KO[userA.talkStyle ?? 'no-preference'];
  const b = TALK_STYLE_LABEL_KO[userB.talkStyle ?? 'no-preference'];
  return `${userA.name}님은 ${a}, ${userB.name}님은 ${b}`;
}

function commonInterestLabels(userA: User, userB: User): string[] {
  const aLabels = new Set([...userA.skillsOffered, ...userA.skillsWanted].map((s) => s.label));
  const bLabels = new Set([...userB.skillsOffered, ...userB.skillsWanted].map((s) => s.label));
  return [...aLabels].filter((label) => bLabels.has(label));
}

/** Best-effort sync to the Vercel backend — never blocks or breaks the local-first flow. */
function syncAppointmentToServer(appointment: Appointment): void {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const token = useAuthStore.getState().sessionToken;
  if (!backendUrl || !token) return;

  fetch(`${backendUrl}/api/appointments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      id: appointment.id,
      threadId: appointment.threadId,
      matchId: appointment.matchId,
      date: appointment.date,
      time: appointment.time,
      safeZoneId: appointment.safeZoneId,
      purpose: appointment.purpose,
      qrToken: appointment.qrToken,
    }),
  }).catch(() => {});
}

function syncCheckInToServer(appointmentId: string): void {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const token = useAuthStore.getState().sessionToken;
  if (!backendUrl || !token) return;

  fetch(`${backendUrl}/api/appointments/checkin`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ appointmentId }),
  }).catch(() => {});
}

interface CreateAppointmentInput {
  matchId: string;
  threadId: string;
  date: string;
  time: string;
  safeZoneId: string;
  purpose?: string;
  createdBy: string;
}

interface AppointmentState {
  appointmentsById: Record<string, Appointment>;
  createAppointment: (input: CreateAppointmentInput) => Appointment;
  checkIn: (appointmentId: string, userId: string) => Appointment | undefined;
  completeAppointment: (appointmentId: string) => void;
  recommendSafeZones: (
    pointA: { lat: number; lng: number },
    pointB: { lat: number; lng: number }
  ) => SafeZone[];
  /**
   * AI Safe-Zone Dynamic Router: asks Gemini to re-rank candidate safe zones for this specific
   * pair — considering the meeting time, gender combination, talk-style (quiet vs lively) fit,
   * and common interests — with a per-zone match score and rationale. Falls back to the plain
   * distance/safety ranking (aiRanked: false) when no API key is configured or the call fails.
   */
  recommendSafeZonesWithAI: (input: {
    userA: User;
    userB: User;
    meetingDate: string;
    meetingTime: string;
  }) => Promise<RankedSafeZone[]>;
  getAppointmentById: (appointmentId: string) => Appointment | undefined;
  /** Nearest upcoming confirmed/checked-in appointment involving this user — powers the home screen banner. */
  getUpcomingAppointmentForUser: (userId: string) => Appointment | undefined;
  /** Fetches every appointment across the current user's threads from the backend and merges them in. No-op if not configured. */
  fetchAppointments: () => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointmentsById: SEED_APPOINTMENTS,

      createAppointment: (input) => {
        const appointment: Appointment = {
          id: generateId('appointment'),
          matchId: input.matchId,
          threadId: input.threadId,
          date: input.date,
          time: input.time,
          safeZoneId: input.safeZoneId,
          purpose: input.purpose,
          status: 'confirmed',
          createdBy: input.createdBy,
          createdAt: new Date().toISOString(),
          qrToken: generateQrToken(),
          checkIns: [],
        };
        set((state) => ({
          appointmentsById: { ...state.appointmentsById, [appointment.id]: appointment },
        }));
        syncAppointmentToServer(appointment);
        return appointment;
      },

      checkIn: (appointmentId, userId) => {
        const appointment = get().appointmentsById[appointmentId];
        if (!appointment) return undefined;
        if (appointment.checkIns.some((c) => c.userId === userId)) return appointment;

        const updated: Appointment = {
          ...appointment,
          status: 'checked-in',
          checkIns: [...appointment.checkIns, { userId, checkedInAt: new Date().toISOString() }],
        };
        set((state) => ({
          appointmentsById: { ...state.appointmentsById, [appointmentId]: updated },
        }));
        syncCheckInToServer(appointmentId);
        return updated;
      },

      completeAppointment: (appointmentId) =>
        set((state) => {
          const appointment = state.appointmentsById[appointmentId];
          if (!appointment) return state;
          return {
            appointmentsById: {
              ...state.appointmentsById,
              [appointmentId]: { ...appointment, status: 'completed' },
            },
          };
        }),

      recommendSafeZones: (pointA, pointB) => {
        const mid = midpoint(pointA, pointB);
        const zones = useSafeZoneStore.getState().safeZones;
        const byDistance = sortByDistanceFrom(mid, zones);
        // Blend proximity ranking with safety score: nearest-first, safety as tiebreaker.
        return [...byDistance].sort((a, b) => {
          const rankA = byDistance.indexOf(a);
          const rankB = byDistance.indexOf(b);
          if (Math.abs(rankA - rankB) <= 1) return b.safetyScore - a.safetyScore;
          return rankA - rankB;
        });
      },

      recommendSafeZonesWithAI: async ({ userA, userB, meetingDate, meetingTime }) => {
        const fallbackZones = get().recommendSafeZones(userA.location, userB.location);
        const asFallback = (): RankedSafeZone[] =>
          fallbackZones.map((zone) => ({ ...zone, matchScore: zone.safetyScore, aiRanked: false }));

        const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) return asFallback();

        const mid = midpoint(userA.location, userB.location);
        try {
          const recommendations = await generateSafeZoneRecommendations({
            apiKey,
            candidates: fallbackZones.map((zone) => ({
              id: zone.id,
              name: zone.name,
              type: zone.type,
              hours: `${zone.hours.days} ${zone.hours.open}~${zone.hours.close}`,
              distanceFromMidpointKm: haversineDistanceKm(mid, zone),
              footTraffic: zone.safetyFactors.footTraffic,
              lighting: zone.safetyFactors.lighting,
              crimeRateInverse: zone.safetyFactors.crimeRateInverse,
              cctvCoverage: zone.safetyFactors.cctvCoverage,
            })),
            context: {
              meetingDateTime: `${meetingDate} ${meetingTime}`,
              userAGender: userA.gender ? GENDER_LABEL_KO[userA.gender] : undefined,
              userBGender: userB.gender ? GENDER_LABEL_KO[userB.gender] : undefined,
              talkStyleSummary: talkStyleSummary(userA, userB),
              commonInterests: commonInterestLabels(userA, userB),
            },
          });

          const byId = new Map(recommendations.map((r) => [r.safeZoneId, r]));
          const ranked: RankedSafeZone[] = [];
          for (const zone of fallbackZones) {
            const rec = byId.get(zone.id);
            if (rec) ranked.push({ ...zone, matchScore: rec.matchScore, aiRationale: rec.rationale, aiRanked: true });
          }
          ranked.sort((a, b) => b.matchScore - a.matchScore);

          const rankedIds = new Set(ranked.map((z) => z.id));
          const unranked = fallbackZones
            .filter((zone) => !rankedIds.has(zone.id))
            .map((zone) => ({ ...zone, matchScore: zone.safetyScore, aiRanked: false }));

          const combined = [...ranked, ...unranked];
          return combined.length > 0 ? combined : asFallback();
        } catch {
          return asFallback();
        }
      },

      getAppointmentById: (appointmentId) => get().appointmentsById[appointmentId],

      getUpcomingAppointmentForUser: (userId) => {
        const getMatchById = useMatchStore.getState().getMatchById;
        const threadsById = useChatStore.getState().threadsById;

        const upcoming = Object.values(get().appointmentsById)
          .filter((a) => a.status === 'confirmed' || a.status === 'checked-in')
          .filter((a) => {
            const thread = threadsById[a.threadId];
            const match = getMatchById(a.matchId);
            return (
              thread?.participantIds.includes(userId) ||
              match?.userAId === userId ||
              match?.userBId === userId
            );
          })
          .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

        return upcoming[0];
      },

      fetchAppointments: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const token = useAuthStore.getState().sessionToken;
        if (!backendUrl || !token) return;

        try {
          const res = await fetch(`${backendUrl}/api/appointments`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;

          const { appointments } = (await res.json()) as { appointments: Appointment[] };
          set((state) => {
            const merged = { ...state.appointmentsById };
            for (const appointment of appointments) {
              if (appointment?.id) merged[appointment.id] = appointment;
            }
            return { appointmentsById: merged };
          });
        } catch {
          // 오프라인이거나 백엔드 미배포 — 로컬 상태 그대로 유지
        }
      },
    }),
    {
      name: 'daitda-appointments',
      storage: asyncStorageAdapter,
    }
  )
);
