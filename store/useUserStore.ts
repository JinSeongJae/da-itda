import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BadgeId, Skill, TimeSlot, User, VerificationStatus } from '../types';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';

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
          usersById: { ...state.usersById, [user.id]: user },
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

      awardBadge: (userId, badgeId) =>
        set((state) => {
          const user = state.usersById[userId];
          if (!user || user.badges.includes(badgeId)) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, badges: [...user.badges, badgeId] },
            },
          };
        }),

      setVerificationStatus: (userId, status) =>
        set((state) => ({
          usersById: {
            ...state.usersById,
            [userId]: { ...state.usersById[userId], verification: status },
          },
        })),

      addPoints: (userId, amount) =>
        set((state) => {
          const user = state.usersById[userId];
          if (!user) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, points: user.points + amount },
            },
          };
        }),

      addVolunteerMinutes: (userId, minutes) =>
        set((state) => {
          const user = state.usersById[userId];
          if (!user) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, volunteerMinutes: user.volunteerMinutes + minutes },
            },
          };
        }),

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
          set((state) => {
            const merged = { ...state.usersById };
            for (const user of users) {
              if (user?.id) merged[user.id] = user;
            }
            return { usersById: merged };
          });
        } catch {
          // 백엔드 미배포/오프라인 — 로컬 상태 그대로 유지
        }
      },
    }),
    {
      name: 'daitda-users',
      storage: asyncStorageAdapter,
    }
  )
);
