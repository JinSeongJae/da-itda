import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeSkill } from '../mocks/skills';
import type { BadgeId, Skill, TimeSlot, User, VerificationStatus } from '../types';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';

/** Repairs a user's embedded skill objects (e.g. a stale category from before a taxonomy change) back to their current canonical definitions. */
function normalizeUser(user: User): User {
  return {
    ...user,
    skillsOffered: user.skillsOffered.map(normalizeSkill),
    skillsWanted: user.skillsWanted.map(normalizeSkill),
  };
}

/** Best-effort sync of the caller's own profile to the backend — never blocks or throws. */
function syncSelfProfile(user: User | undefined): void {
  if (!user) return;
  const { currentUserId, sessionToken } = useAuthStore.getState();
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!backendUrl || !sessionToken || user.id !== currentUserId) return;

  fetch(`${backendUrl}/api/users/me`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${sessionToken}` },
    body: JSON.stringify(user),
  }).catch(() => {});
}

interface UserState {
  usersById: Record<string, User>;
  addUser: (user: User) => void;
  updateProfile: (userId: string, patch: Partial<User>) => void;
  addSkillOffered: (userId: string, skill: Skill) => void;
  removeSkillOffered: (userId: string, skillId: string) => void;
  addSkillWanted: (userId: string, skill: Skill) => void;
  removeSkillWanted: (userId: string, skillId: string) => void;
  setAvailability: (userId: string, availability: TimeSlot[]) => void;
  awardBadge: (userId: string, badgeId: BadgeId) => void;
  addBestFriendNeighbor: (userId: string, counterpartId: string) => void;
  setVerificationStatus: (userId: string, status: VerificationStatus) => void;
  addPoints: (userId: string, amount: number) => void;
  addVolunteerMinutes: (userId: string, minutes: number) => void;
  getUserById: (userId: string) => User | undefined;
  /** Fetches every onboarded real user from the backend and merges them in. No-op if not configured. */
  fetchAllUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      usersById: {},

      addUser: (user) =>
        set((state) => ({
          usersById: { ...state.usersById, [user.id]: normalizeUser(user) },
        })),

      updateProfile: (userId, patch) => {
        set((state) => ({
          usersById: {
            ...state.usersById,
            [userId]: { ...state.usersById[userId], ...patch },
          },
        }));
        syncSelfProfile(get().usersById[userId]);
      },

      addSkillOffered: (userId, skill) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user || user.skillsOffered.some((s) => s.id === skill.id)) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, skillsOffered: [...user.skillsOffered, skill] },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      removeSkillOffered: (userId, skillId) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: {
                ...user,
                skillsOffered: user.skillsOffered.filter((s) => s.id !== skillId),
              },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      addSkillWanted: (userId, skill) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user || user.skillsWanted.some((s) => s.id === skill.id)) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, skillsWanted: [...user.skillsWanted, skill] },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      removeSkillWanted: (userId, skillId) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: {
                ...user,
                skillsWanted: user.skillsWanted.filter((s) => s.id !== skillId),
              },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      setAvailability: (userId, availability) => {
        set((state) => ({
          usersById: {
            ...state.usersById,
            [userId]: { ...state.usersById[userId], availability },
          },
        }));
        syncSelfProfile(get().usersById[userId]);
      },

      awardBadge: (userId, badgeId) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user || user.badges.includes(badgeId)) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, badges: [...user.badges, badgeId] },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      addBestFriendNeighbor: (userId, counterpartId) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user || user.bestFriendNeighborIds?.includes(counterpartId)) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: {
                ...user,
                bestFriendNeighborIds: [...(user.bestFriendNeighborIds ?? []), counterpartId],
              },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      setVerificationStatus: (userId, status) => {
        set((state) => ({
          usersById: {
            ...state.usersById,
            [userId]: { ...state.usersById[userId], verification: status },
          },
        }));
        syncSelfProfile(get().usersById[userId]);
      },

      addPoints: (userId, amount) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, points: user.points + amount },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      addVolunteerMinutes: (userId, minutes) => {
        set((state) => {
          const user = state.usersById[userId];
          if (!user) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, volunteerMinutes: user.volunteerMinutes + minutes },
            },
          };
        });
        syncSelfProfile(get().usersById[userId]);
      },

      getUserById: (userId) => get().usersById[userId],

      fetchAllUsers: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const token = useAuthStore.getState().sessionToken;
        if (!backendUrl || !token) return;

        try {
          const res = await fetch(`${backendUrl}/api/users`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;

          const { users } = (await res.json()) as { users: User[] };
          const selfId = useAuthStore.getState().currentUserId;
          let selfChanged = false;
          set((state) => {
            // 서버 응답을 그대로 정답으로 삼아 통째로 교체한다(merge가 아님) — 예전 로컬
            // 테스트 중 addUser로 남아있던 목업 유저(Jasmin, 이지은 등)가 실제 유저 목록에서
            // 절대 사라지지 않던 문제의 원인이었다.
            const fresh: Record<string, User> = {};
            for (const user of users) {
              if (!user?.id) continue;
              const normalized = normalizeUser(user);
              if (user.id === selfId && JSON.stringify(normalized) !== JSON.stringify(user)) {
                selfChanged = true;
              }
              fresh[user.id] = normalized;
            }
            // 온보딩 직후처럼 자기 프로필의 서버 동기화가 아직 안 끝났을 때도 자기 자신은
            // 화면에서 사라지면 안 되므로, 그 경우에만 로컬 값을 유지한다.
            if (selfId && !fresh[selfId] && state.usersById[selfId]) {
              fresh[selfId] = state.usersById[selfId];
            }
            return { usersById: fresh };
          });

          if (selfChanged && selfId) syncSelfProfile(get().usersById[selfId]);
        } catch {
          // 백엔드 미배포/오프라인 — 로컬 상태 그대로 유지
        }
      },
    }),
    {
      name: 'daitda-users',
      storage: asyncStorageAdapter,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        for (const id of Object.keys(state.usersById)) {
          state.usersById[id] = normalizeUser(state.usersById[id]);
        }
      },
    }
  )
);
