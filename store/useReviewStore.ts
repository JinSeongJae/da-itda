import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReviewChecklist } from '../types';
import { generateId } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useAppointmentStore } from './useAppointmentStore';
import { useChatStore } from './useChatStore';
import { useMatchStore } from './useMatchStore';
import { useUserStore } from './useUserStore';

interface ReviewAnswers {
  metAtSafeZone: boolean;
  exchangeWentWell: boolean;
  hadUncomfortableIncident: boolean;
}

interface ReviewState {
  checklistsByAppointment: Record<string, ReviewChecklist[]>;
  submitReview: (appointmentId: string, reviewerId: string, answers: ReviewAnswers) => ReviewChecklist;
  isPositiveReview: (review: ReviewChecklist) => boolean;
  isEligibleForBadge: (appointmentId: string) => boolean;
  /** Awards the badge + unlocks the direct channel if both sides reviewed positively. Returns true if awarded. */
  evaluateAndAwardBadge: (appointmentId: string) => boolean;
  getReviewsForAppointment: (appointmentId: string) => ReviewChecklist[];
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

        useUserStore.getState().awardBadge(match.userAId, 'best-friend-neighbor');
        useUserStore.getState().awardBadge(match.userBId, 'best-friend-neighbor');
        useChatStore.getState().unlockDirectChannel(appointment.threadId);
        useMatchStore.getState().setMatchStatus(match.id, 'directChannel');
        useAppointmentStore.getState().completeAppointment(appointmentId);

        return true;
      },

      getReviewsForAppointment: (appointmentId) => get().checklistsByAppointment[appointmentId] ?? [],
    }),
    {
      name: 'daitda-reviews',
      storage: asyncStorageAdapter,
    }
  )
);
