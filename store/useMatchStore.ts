import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityCourse, MatchResult, MatchStatus, MicroGroupSuggestion } from '../types';
import { SEED_ACTIVITY_COURSES } from '../mocks/activityCourses';
import { SEED_MATCHES } from '../mocks/matches';
import { SEED_MICRO_GROUPS } from '../mocks/microGroups';
import { generateId } from '../utils/id';
import { computeCompatibilityScore, computeMatchFactorScores, generateActivityCourse } from '../utils/matchAlgorithm';
import { asyncStorageAdapter } from './storage';
import { useUserStore } from './useUserStore';

interface MatchState {
  matches: MatchResult[];
  activityCourses: Record<string, ActivityCourse>;
  microGroups: MicroGroupSuggestion[];
  /** Finds (or instantly creates) the accepted match between two users — used by the home screen's <매칭하기> card. */
  confirmMatch: (userAId: string, userBId: string) => MatchResult;
  setMatchStatus: (matchId: string, status: MatchStatus) => void;
  acceptMatch: (matchId: string) => void;
  toggleMicroGroupInterest: (groupId: string, userId: string) => void;
  getMatchById: (matchId: string) => MatchResult | undefined;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      matches: SEED_MATCHES,
      activityCourses: SEED_ACTIVITY_COURSES,
      microGroups: SEED_MICRO_GROUPS,

      confirmMatch: (userAId, userBId) => {
        const existing = get().matches.find(
          (m) =>
            (m.userAId === userAId && m.userBId === userBId) ||
            (m.userAId === userBId && m.userBId === userAId)
        );
        if (existing) {
          if (existing.status === 'suggested') get().setMatchStatus(existing.id, 'accepted');
          return existing;
        }

        const userA = useUserStore.getState().getUserById(userAId);
        const userB = useUserStore.getState().getUserById(userBId);
        if (!userA || !userB) throw new Error('매칭할 사용자를 찾을 수 없습니다.');

        const factorScores = computeMatchFactorScores(userA, userB);
        const match: MatchResult = {
          id: generateId('match'),
          userAId: userA.id,
          userBId: userB.id,
          compatibilityScore: computeCompatibilityScore(factorScores),
          factorScores,
          status: 'accepted',
          createdAt: new Date().toISOString(),
        };
        const course = generateActivityCourse(match.id, userA, userB);

        set((state) => ({
          matches: [...state.matches, match],
          activityCourses: { ...state.activityCourses, [match.id]: course },
        }));

        return match;
      },

      setMatchStatus: (matchId, status) =>
        set((state) => ({
          matches: state.matches.map((m) => (m.id === matchId ? { ...m, status } : m)),
        })),

      acceptMatch: (matchId) => get().setMatchStatus(matchId, 'accepted'),

      toggleMicroGroupInterest: (groupId, userId) =>
        set((state) => ({
          microGroups: state.microGroups.map((g) =>
            g.id !== groupId
              ? g
              : {
                  ...g,
                  interestedUserIds: g.interestedUserIds.includes(userId)
                    ? g.interestedUserIds.filter((id) => id !== userId)
                    : [...g.interestedUserIds, userId],
                }
          ),
        })),

      getMatchById: (matchId) => get().matches.find((m) => m.id === matchId),
    }),
    {
      name: 'daitda-matches',
      storage: asyncStorageAdapter,
    }
  )
);
