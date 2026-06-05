'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition, useRef } from 'react';
import { locales, localeMetadata, type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/helpers';

interface LanguageSwitcherProps {
  /** Compact mode — shows native script only */
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  compact = false,
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    const nextPath = segments.join('/') || `/${next}`;
    startTransition(() => router.replace(nextPath));
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Language selection"
      className={cn(
        'relative flex items-center gap-0.5 rounded-full p-1',
        'bg-[var(--lang-pill-bg)] border border-[var(--lang-pill-border)]',
        'transition-all duration-200',
        isPending && 'opacity-70 pointer-events-none',
        className
      )}
    >
      {locales.map((loc) => {
        const meta = localeMetadata[loc];
        const isActive = loc === locale;

        return (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            lang={meta.lang}
            aria-pressed={isActive}
            aria-label={`Switch to ${meta.label}`}
            className={cn(
              'relative z-10 rounded-full px-3 py-1 text-xs font-medium',
              'transition-all duration-[var(--transition-spring)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-1',
              'select-none cursor-pointer whitespace-nowrap',
              isActive
                ? [
                    'bg-[var(--lang-pill-active-bg)]',
                    'text-[var(--lang-pill-active-text)]',
                    'shadow-sm scale-[1.02]',
                  ]
                : [
                    'text-[var(--lang-pill-text)]',
                    'hover:text-[var(--text-primary)]',
                    'hover:bg-[var(--bg-surface-2)]',
                  ]
            )}
          >
            <span>{meta.nativeLabel}</span>
            {!compact && loc !== 'en' && (
              <span className="sr-only">{meta.label}</span>
            )}
            {isActive && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -bottom-0.5 left-1/2 -translate-x-1/2',
                  'w-1 h-1 rounded-full',
                  'bg-[var(--lang-pill-active-text)] opacity-60'
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
