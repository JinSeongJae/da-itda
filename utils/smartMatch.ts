import type { User, Weekday } from '../types';
import { computeCompatibilityScore, computeMatchFactorScores } from './matchAlgorithm';
import { haversineDistanceKm } from './distance';

/** Smart 급매칭: only surfaces matches close enough to meet up spontaneously. */
const URGENT_MAX_DISTANCE_KM = 3;
/** Compatibility floor — reuses the same 40-99 scale as the home screen's "top 3" ranking. */
const URGENT_MIN_COMPATIBILITY_SCORE = 60;
/**
 * Foreground-only tracking means a user's liveLocation is only as fresh as their last app
 * open. With a once-daily scan, a same-day fix (e.g. from opening the app at lunch) should
 * still count for an evening push — but a fix from yesterday or earlier should not.
 */
export const LIVE_LOCATION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

const KST_WEEKDAYS: Weekday[] = ['일', '월', '화', '수', '목', '금', '토'];

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function nowInKst(now: Date): { weekday: Weekday; minutesSinceMidnight: number } {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return {
    weekday: KST_WEEKDAYS[kst.getUTCDay()],
    minutesSinceMidnight: kst.getUTCHours() * 60 + kst.getUTCMinutes(),
  };
}

/** Whether `now` (KST) falls inside one of the user's recurring weekly availability slots. */
export function isAvailableNow(user: User, now: Date): boolean {
  const { weekday, minutesSinceMidnight } = nowInKst(now);
  return user.availability.some(
    (slot) =>
      slot.day === weekday &&
      timeToMinutes(slot.start) <= minutesSinceMidnight &&
      minutesSinceMidnight < timeToMinutes(slot.end)
  );
}

export function hasFreshLiveLocation(user: User, now: Date): boolean {
  if (!user.liveLocation) return false;
  return now.getTime() - new Date(user.liveLocation.updatedAt).getTime() <= LIVE_LOCATION_MAX_AGE_MS;
}

export interface UrgentMatch {
  user: User;
  match: User;
  distanceKm: number;
  compatibilityScore: number;
}

/**
 * For each pushable user who is nearby-fresh and free right now, finds their single best
 * urgent match among other equally nearby-fresh-and-free users. Pure/deterministic — safe to
 * unit test and to reuse from both the cron job and any future in-app "지금 만날 수 있어요" view.
 */
export function findUrgentMatches(users: User[], now: Date = new Date()): UrgentMatch[] {
  const eligible = users.filter(
    (u) => !!u.pushToken && hasFreshLiveLocation(u, now) && isAvailableNow(u, now)
  );

  const results: UrgentMatch[] = [];
  for (const user of eligible) {
    let best: UrgentMatch | undefined;
    for (const other of eligible) {
      if (other.id === user.id) continue;

      const distanceKm = haversineDistanceKm(user.liveLocation!, other.liveLocation!);
      if (distanceKm > URGENT_MAX_DISTANCE_KM) continue;

      const compatibilityScore = computeCompatibilityScore(computeMatchFactorScores(user, other));
      if (compatibilityScore < URGENT_MIN_COMPATIBILITY_SCORE) continue;

      if (!best || compatibilityScore > best.compatibilityScore) {
        best = { user, match: other, distanceKm, compatibilityScore };
      }
    }
    if (best) results.push(best);
  }
  return results;
}
