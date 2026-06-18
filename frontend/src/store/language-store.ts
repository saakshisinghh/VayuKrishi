// src/store/language-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SupportedLocale = "en" | "hi" | "mr" | "gu" | "ta" | "kn";

interface LanguageState {
  language: SupportedLocale;
  setLanguage: (lang: SupportedLocale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "hi",
      setLanguage: (language) => set({ language }),
    }),
    { name: "vayukrishi-language" }
  )
);
