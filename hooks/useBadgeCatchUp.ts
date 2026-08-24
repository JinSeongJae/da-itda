import { useEffect } from 'react';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { useAuthStore } from '../store/useAuthStore';
import { useMatchStore } from '../store/useMatchStore';
import { useReviewStore } from '../store/useReviewStore';
import { useUserStore } from '../store/useUserStore';

const POLL_INTERVAL_MS = 15000;

/**
 * The review screen only awards 단짝 이웃 while the reviewer stays on that screen waiting for
 * their counterpart's review to arrive — if they navigate away first (the common case, since the
 * counterpart may take hours to review), the badge never gets checked again. This runs app-wide
 * for as long as the app is open, so eligibility is re-checked independently of which screen
 * either side happens to be looking at.
 */
export function useBadgeCatchUp() {
  useEffect(() => {
    const check = async () => {
      const currentUserId = useAuthStore.getState().currentUserId;
      if (!currentUserId) return;

      await useAppointmentStore.getState().fetchAppointments();

      const { appointmentsById } = useAppointmentStore.getState();
      const { getMatchById } = useMatchStore.getState();
      const { fetchReviewsForAppointment, isEligibleForBadge, evaluateAndAwardBadge } = useReviewStore.getState();
      const user = useUserStore.getState().usersById[currentUserId];
      if (!user) return;

      const candidates = Object.values(appointmentsById).filter((a) => {
        if (a.status !== 'checked-in' && a.status !== 'completed') return false;
        const match = getMatchById(a.matchId);
        if (!match) return false;
        if (match.userAId !== currentUserId && match.userBId !== currentUserId) return false;
        const counterpartId = match.userAId === currentUserId ? match.userBId : match.userAId;
        return !user.bestFriendNeighborIds?.includes(counterpartId);
      });

      for (const appointment of candidates) {
        await fetchReviewsForAppointment(appointment.id);
        if (isEligibleForBadge(appointment.id)) evaluateAndAwardBadge(appointment.id);
      }
    };

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
}
