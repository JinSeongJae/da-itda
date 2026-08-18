import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appointment, SafeZone } from '../types';
import { SEED_APPOINTMENTS } from '../mocks/appointments';
import { midpoint, sortByDistanceFrom } from '../utils/distance';
import { generateId, generateQrToken } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useChatStore } from './useChatStore';
import { useMatchStore } from './useMatchStore';
import { useSafeZoneStore } from './useSafeZoneStore';

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
  getAppointmentById: (appointmentId: string) => Appointment | undefined;
  /** Nearest upcoming confirmed/checked-in appointment involving this user — powers the home screen banner. */
  getUpcomingAppointmentForUser: (userId: string) => Appointment | undefined;
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
    }),
    {
      name: 'daitda-appointments',
      storage: asyncStorageAdapter,
    }
  )
);
