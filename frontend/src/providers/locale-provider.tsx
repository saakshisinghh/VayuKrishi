'use client';

import { NextIntlClientProvider } from 'next-intl';
import { type Locale } from '@/lib/i18n/config';

interface LocaleProviderProps {
  locale: Locale;
  messages: Record<string, unknown>;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Kolkata"
    >
      {children}
    </NextIntlClientProvider>
  );
}
