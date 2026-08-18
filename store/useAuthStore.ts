import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorageAdapter } from './storage';

interface AuthState {
  isOnboarded: boolean;
  currentUserId: string | null;
  sessionToken: string | null;
  /** Called right after a successful Kakao OAuth exchange, before skills are collected. */
  loginWithKakao: (token: string, userId: string) => void;
  completeOnboarding: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      currentUserId: null,
      sessionToken: null,

      loginWithKakao: (token, userId) => set({ sessionToken: token, currentUserId: userId }),

      completeOnboarding: (userId) => set({ isOnboarded: true, currentUserId: userId }),

      logout: () => set({ isOnboarded: false, currentUserId: null, sessionToken: null }),
    }),
    {
      name: 'daitda-auth',
      storage: asyncStorageAdapter,
    }
  )
);
