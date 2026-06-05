import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, defaultLocale } from '@/lib/i18n/config';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'vayukrishi-locale',
    }
  )
);
