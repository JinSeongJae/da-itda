import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityCourse, MatchResult, MatchStatus, MicroGroupSuggestion } from '../types';
import { SEED_ACTIVITY_COURSES } from '../mocks/activityCourses';
import { SEED_MICRO_GROUPS } from '../mocks/microGroups';
import { generateId } from '../utils/id';
import { computeCompatibilityScore, computeMatchFactorScores, generateActivityCourse } from '../utils/matchAlgorithm';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';
import { useUserStore } from './useUserStore';

interface CreateMicroGroupInput {
  title: string;
  location: string;
  date: string;
  category: string;
  maxParticipants: number;
}

function authHeaders(): Record<string, string> | undefined {
  const token = useAuthStore.getState().sessionToken;
  return token ? { authorization: `Bearer ${token}` } : undefined;
}

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
  fetchMicroGroups: () => Promise<void>;
  createMicroGroup: (authorId: string, input: CreateMicroGroupInput) => Promise<MicroGroupSuggestion>;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      matches: [],
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

      toggleMicroGroupInterest: (groupId, userId) => {
        const group = get().microGroups.find((g) => g.id === groupId);
        const wasInterested = !!group?.interestedUserIds.includes(userId);

        set((state) => ({
          microGroups: state.microGroups.map((g) =>
            g.id !== groupId
              ? g
              : {
                  ...g,
                  interestedUserIds: wasInterested
                    ? g.interestedUserIds.filter((id) => id !== userId)
                    : [...g.interestedUserIds, userId],
                }
          ),
        }));

        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return;
        fetch(`${backendUrl}/api/cultural-map/pins`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json', ...headers },
          body: JSON.stringify({ resource: 'micro-group', id: groupId, action: wasInterested ? 'leave' : 'join' }),
        }).catch(() => {});
      },

      getMatchById: (matchId) => get().matches.find((m) => m.id === matchId),

      fetchMicroGroups: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return;

        try {
          const res = await fetch(`${backendUrl}/api/cultural-map/pins?resource=micro-group`, { headers });
          if (!res.ok) return;
          const { microGroups } = (await res.json()) as { microGroups: MicroGroupSuggestion[] };
          set((state) => {
            const merged = { ...Object.fromEntries(state.microGroups.map((g) => [g.id, g])) };
            for (const group of microGroups) {
              if (group?.id) merged[group.id] = group;
            }
            return { microGroups: Object.values(merged) };
          });
        } catch {
          // 오프라인이거나 백엔드 미배포 — 로컬(시드) 상태 그대로 유지
        }
      },

      createMicroGroup: async (authorId, input) => {
        const group: MicroGroupSuggestion = {
          id: generateId('microgroup'),
          authorId,
          title: input.title,
          location: input.location,
          date: input.date,
          category: input.category,
          maxParticipants: input.maxParticipants,
          interestedUserIds: [authorId],
        };
        set((state) => ({ microGroups: [group, ...state.microGroups] }));

        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (backendUrl && headers) {
          fetch(`${backendUrl}/api/cultural-map/pins`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({
              resource: 'micro-group',
              id: group.id,
              title: group.title,
              location: group.location,
              date: group.date,
              category: group.category,
              maxParticipants: group.maxParticipants,
            }),
          }).catch(() => {});
        }

        return group;
      },
    }),
    {
      name: 'daitda-matches',
      storage: asyncStorageAdapter,
    }
  )
);
