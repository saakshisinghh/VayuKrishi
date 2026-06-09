export const locales = ["en", "hi", "mr", "gu", "ta", "kn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
  gu: "ગુજરાતી",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
};
