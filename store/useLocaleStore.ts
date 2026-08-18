import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '../constants/i18n';
import { asyncStorageAdapter } from './storage';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'ko',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'daitda-locale',
      storage: asyncStorageAdapter,
    }
  )
);
