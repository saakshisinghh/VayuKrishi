export const locales = ['en', 'mr', 'hi', 'gu', 'ta', 'kn'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMetadata: Record<
  Locale,
  { label: string; nativeLabel: string; dir: 'ltr' | 'rtl'; lang: string }
> = {
  en: { label: 'English', nativeLabel: 'English', dir: 'ltr', lang: 'en' },
  mr: { label: 'Marathi',  nativeLabel: 'मराठी',   dir: 'ltr', lang: 'mr' },
  hi: { label: 'Hindi',    nativeLabel: 'हिन्दी',  dir: 'ltr', lang: 'hi' },
  gu: { label: 'Gujarati', nativeLabel: 'ગુજરાતી', dir: 'ltr', lang: 'gu' },
  ta: { label: 'Tamil',    nativeLabel: 'தமிழ்',   dir: 'ltr', lang: 'ta' },
  kn: { label: 'Kannada',  nativeLabel: 'ಕನ್ನಡ',   dir: 'ltr', lang: 'kn' },
};
