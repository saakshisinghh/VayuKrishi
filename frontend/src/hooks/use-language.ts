'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { type Locale, localeMetadata, locales } from '@/lib/i18n/config';

export function useLanguage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    const nextPath = segments.join('/') || `/${next}`;
    startTransition(() => router.replace(nextPath));
  };

  return {
    locale,
    locales,
    localeMetadata,
    currentMeta: localeMetadata[locale],
    switchLocale,
    isPending,
  };
}
