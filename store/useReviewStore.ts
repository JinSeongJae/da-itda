import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReviewChecklist } from '../types';
import { generateId } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useAppointmentStore } from './useAppointmentStore';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';
import { useMatchStore } from './useMatchStore';
import { useUserStore } from './useUserStore';

interface ReviewAnswers {
  metAtSafeZone: boolean;
  exchangeWentWell: boolean;
  hadUncomfortableIncident: boolean;
}

/** Best-effort sync to the Vercel backend — never blocks or breaks the local-first flow. */
function syncReviewToServer(review: ReviewChecklist): void {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const token = useAuthStore.getState().sessionToken;
  if (!backendUrl || !token) return;

  fetch(`${backendUrl}/api/reviews`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      id: review.id,
      appointmentId: review.appointmentId,
      metAtSafeZone: review.metAtSafeZone,
      exchangeWentWell: review.exchangeWentWell,
      hadUncomfortableIncident: review.hadUncomfortableIncident,
    }),
  }).catch(() => {});
}

interface ReviewState {
  checklistsByAppointment: Record<string, ReviewChecklist[]>;
  submitReview: (appointmentId: string, reviewerId: string, answers: ReviewAnswers) => ReviewChecklist;
  isPositiveReview: (review: ReviewChecklist) => boolean;
  isEligibleForBadge: (appointmentId: string) => boolean;
  /**
   * Awards the badge + records the 단짝 이웃 relationship for the CURRENT device's own user only,
   * if both sides reviewed positively. The other participant's own device independently runs this
   * same check (after fetching reviews) to award itself — there's no way to durably credit another
   * user's account from this device (see syncSelfProfile's self-only guard). Returns true if awarded.
   */
  evaluateAndAwardBadge: (appointmentId: string) => boolean;
  getReviewsForAppointment: (appointmentId: string) => ReviewChecklist[];
  /** Hydrates both sides' reviews for one appointment from the backend. No-op if not configured. */
  fetchReviewsForAppointment: (appointmentId: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      checklistsByAppointment: {},

      submitReview: (appointmentId, reviewerId, answers) => {
        const review: ReviewChecklist = {
          id: generateId('review'),
          appointmentId,
          reviewerId,
          ...answers,
          submittedAt: new Date().toISOString(),
        };
        set((state) => {
          const existing = state.checklistsByAppointment[appointmentId] ?? [];
          const withoutReviewer = existing.filter((r) => r.reviewerId !== reviewerId);
          return {
            checklistsByAppointment: {
              ...state.checklistsByAppointment,
              [appointmentId]: [...withoutReviewer, review],
            },
          };
        });
        syncReviewToServer(review);
        return review;
      },

      // A "good" outcome requires yes/yes/no — question 3 asks about a NEGATIVE event.
      isPositiveReview: (review) =>
        review.metAtSafeZone && review.exchangeWentWell && !review.hadUncomfortableIncident,

      isEligibleForBadge: (appointmentId) => {
        const appointment = useAppointmentStore.getState().getAppointmentById(appointmentId);
        if (!appointment) return false;
        const match = useMatchStore.getState().getMatchById(appointment.matchId);
        if (!match) return false;

        const reviews = get().checklistsByAppointment[appointmentId] ?? [];
        const participantIds = [match.userAId, match.userBId];
        const reviewsByParticipants = participantIds.map((id) =>
          reviews.find((r) => r.reviewerId === id)
        );

        if (reviewsByParticipants.some((r) => !r)) return false;
        return reviewsByParticipants.every((r) => r && get().isPositiveReview(r));
      },

      evaluateAndAwardBadge: (appointmentId) => {
        if (!get().isEligibleForBadge(appointmentId)) return false;

        const appointment = useAppointmentStore.getState().getAppointmentById(appointmentId);
        if (!appointment) return false;
        const match = useMatchStore.getState().getMatchById(appointment.matchId);
        if (!match) return false;

        const selfId = useAuthStore.getState().currentUserId;
        if (!selfId) return false;
        const counterpartId = match.userAId === selfId ? match.userBId : match.userAId;
        if (match.userAId !== selfId && match.userBId !== selfId) return false;

        useUserStore.getState().awardBadge(selfId, 'best-friend-neighbor');
        useUserStore.getState().addBestFriendNeighbor(selfId, counterpartId);
        useChatStore.getState().unlockDirectChannel(appointment.threadId);
        useMatchStore.getState().setMatchStatus(match.id, 'directChannel');
        useAppointmentStore.getState().completeAppointment(appointmentId);

        return true;
      },

      getReviewsForAppointment: (appointmentId) => get().checklistsByAppointment[appointmentId] ?? [],

      fetchReviewsForAppointment: async (appointmentId) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const token = useAuthStore.getState().sessionToken;
        if (!backendUrl || !token) return;

        try {
          const res = await fetch(
            `${backendUrl}/api/reviews?appointmentId=${encodeURIComponent(appointmentId)}`,
            { headers: { authorization: `Bearer ${token}` } }
          );
          if (!res.ok) return;

          const { reviews } = (await res.json()) as { reviews: ReviewChecklist[] };
          set((state) => ({
            checklistsByAppointment: { ...state.checklistsByAppointment, [appointmentId]: reviews },
          }));
        } catch {
          // 오프라인이거나 백엔드 미배포 — 로컬 상태 그대로 유지
        }
      },
    }),
    {
      name: 'daitda-reviews',
      storage: asyncStorageAdapter,
    }
  )
);
