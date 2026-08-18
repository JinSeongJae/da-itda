import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BadgeId, Skill, TimeSlot, User, VerificationStatus } from '../types';
import { SEED_USERS } from '../mocks/users';
import { asyncStorageAdapter } from './storage';

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
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      usersById: SEED_USERS,

      addUser: (user) =>
        set((state) => ({
          usersById: { ...state.usersById, [user.id]: user },
        })),

      updateProfile: (userId, patch) =>
        set((state) => ({
          usersById: {
            ...state.usersById,
            [userId]: { ...state.usersById[userId], ...patch },
          },
        })),

      addSkillOffered: (userId, skill) =>
        set((state) => {
          const user = state.usersById[userId];
          if (!user || user.skillsOffered.some((s) => s.id === skill.id)) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, skillsOffered: [...user.skillsOffered, skill] },
            },
          };
        }),

      removeSkillOffered: (userId, skillId) =>
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
        }),

      addSkillWanted: (userId, skill) =>
        set((state) => {
          const user = state.usersById[userId];
          if (!user || user.skillsWanted.some((s) => s.id === skill.id)) return state;
          return {
            usersById: {
              ...state.usersById,
              [userId]: { ...user, skillsWanted: [...user.skillsWanted, skill] },
            },
          };
        }),

      removeSkillWanted: (userId, skillId) =>
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
        }),

      setAvailability: (userId, availability) =>
        set((state) => ({
          usersById: {
            ...state.usersById,
            [userId]: { ...state.usersById[userId], availability },
          },
        })),

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
    }),
    {
      name: 'daitda-users',
      storage: asyncStorageAdapter,
    }
  )
);
