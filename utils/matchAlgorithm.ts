import type { ActivityCourse, ActivitySegment, MatchFactorScores, User } from '../types';
import { distanceToScore, haversineDistanceKm } from './distance';
import { generateId } from './id';

/**
 * Mock "AI" compatibility scorer. Not ML — a documented, weighted heuristic
 * standing in for the real recommendation service, so the demo is fully
 * deterministic and explainable in the UI (each factor is shown to the user).
 */
const WEIGHTS: Record<keyof MatchFactorScores, number> = {
  skillComplementarity: 0.4,
  interestOverlap: 0.05,
  distanceScore: 0.15,
  mbtiCompat: 0.1,
  timeOverlap: 0.3,
};

// Simplified MBTI compatibility lookup: shared letters -> lower novelty, so we
// reward a mix of overlap and complementary axes rather than exact matches.
function mbtiCompatScore(a?: string, b?: string): number {
  if (!a || !b) return 60;
  let shared = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) shared += 1;
  }
  // 2 shared letters (some common ground, some contrast) scores highest.
  const table = [55, 70, 92, 80, 60];
  return table[shared] ?? 60;
}

function skillComplementarityScore(a: User, b: User): number {
  const aWantsFromB = a.skillsWanted.filter((wanted) =>
    b.skillsOffered.some((offered) => offered.category === wanted.category)
  ).length;
  const bWantsFromA = b.skillsWanted.filter((wanted) =>
    a.skillsOffered.some((offered) => offered.category === wanted.category)
  ).length;
  const maxPossible = Math.max(a.skillsWanted.length + b.skillsWanted.length, 1);
  return Math.round(((aWantsFromB + bWantsFromA) / maxPossible) * 100);
}

function interestOverlapScore(a: User, b: User): number {
  const aCategories = new Set(a.skillsOffered.map((s) => s.category));
  const bCategories = new Set(b.skillsOffered.map((s) => s.category));
  const overlap = [...aCategories].filter((c) => bCategories.has(c)).length;
  const union = new Set([...aCategories, ...bCategories]).size || 1;
  return Math.round((overlap / union) * 100);
}

function timeOverlapScore(a: User, b: User): number {
  const overlaps = a.availability.filter((slotA) =>
    b.availability.some(
      (slotB) => slotA.day === slotB.day && slotA.start < slotB.end && slotB.start < slotA.end
    )
  ).length;
  const maxPossible = Math.max(a.availability.length, b.availability.length, 1);
  return Math.round((overlaps / maxPossible) * 100);
}

export function computeMatchFactorScores(a: User, b: User): MatchFactorScores {
  const km = haversineDistanceKm(a.location, b.location);
  return {
    skillComplementarity: skillComplementarityScore(a, b),
    interestOverlap: interestOverlapScore(a, b),
    distanceScore: distanceToScore(km, 20),
    mbtiCompat: mbtiCompatScore(a.mbti, b.mbti),
    timeOverlap: timeOverlapScore(a, b),
  };
}

export function computeCompatibilityScore(factors: MatchFactorScores): number {
  const weighted = (Object.keys(WEIGHTS) as (keyof MatchFactorScores)[]).reduce(
    (sum, key) => sum + factors[key] * WEIGHTS[key],
    0
  );
  return Math.round(Math.min(99, Math.max(40, weighted)));
}

export interface RankedCandidate {
  candidate: User;
  factorScores: MatchFactorScores;
  compatibilityScore: number;
}

/** Ranks candidate neighbors against a user for the home screen's "top 3" recommendations. */
export function rankCandidates(user: User, candidates: User[]): RankedCandidate[] {
  return candidates
    .map((candidate) => {
      const factorScores = computeMatchFactorScores(user, candidate);
      return { candidate, factorScores, compatibilityScore: computeCompatibilityScore(factorScores) };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

/**
 * Auto-generates a 1-hour exchange plan: each side teaches their top offered
 * skill for 30 minutes. A simple, explainable stand-in for a real planner.
 */
export function generateActivityCourse(matchId: string, userA: User, userB: User): ActivityCourse {
  const segments: ActivitySegment[] = [];
  const skillA = userA.skillsOffered[0];
  const skillB = userB.skillsOffered[0];

  if (skillA) {
    segments.push({
      order: 1,
      durationMinutes: 30,
      title: `${skillA.label} 함께 해보기`,
      description: `${userA.name}님이 "${skillA.label}"을(를) 알려드려요.`,
      ledByUserId: userA.id,
    });
  }
  if (skillB) {
    segments.push({
      order: segments.length + 1,
      durationMinutes: 30,
      title: `${skillB.label} 함께 해보기`,
      description: `${userB.name}님이 "${skillB.label}"을(를) 알려드려요.`,
      ledByUserId: userB.id,
    });
  }

  return {
    id: generateId('course'),
    matchId,
    totalDurationMinutes: segments.reduce((sum, s) => sum + s.durationMinutes, 0),
    segments,
  };
}
