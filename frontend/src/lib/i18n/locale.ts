// src/lib/i18n/locale.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales — matches your 6 languages from the blueprint
  locales: ['en', 'hi', 'mr', 'gu', 'ta', 'kn'],

  // Default locale
  defaultLocale: 'en',
});