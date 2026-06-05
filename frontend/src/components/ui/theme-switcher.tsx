'use client';

import { useTranslations } from 'next-intl';
import { useUIStore, type Theme } from '@/store/ui-store';
import { cn } from '@/lib/utils/helpers';

const SunIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const THEME_CONFIG: {
  value: Theme;
  icon: React.ReactNode;
  labelKey: 'light' | 'dark' | 'system';
}[] = [
  { value: 'light',  icon: <SunIcon />,     labelKey: 'light'  },
  { value: 'dark',   icon: <MoonIcon />,    labelKey: 'dark'   },
  { value: 'system', icon: <MonitorIcon />, labelKey: 'system' },
];

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const t = useTranslations('theme');
  const { theme, setTheme } = useUIStore();

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className={cn(
        'flex items-center gap-0.5 rounded-full p-1',
        'bg-[var(--lang-pill-bg)] border border-[var(--lang-pill-border)]',
        className
      )}
    >
      {THEME_CONFIG.map(({ value, icon, labelKey }) => {
        const isActive = value === theme;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            aria-label={t(labelKey)}
            title={t(labelKey)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1',
              'text-xs font-medium',
              'transition-all duration-[var(--transition-spring)]',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-1',
              'select-none cursor-pointer',
              isActive
                ? 'bg-[var(--lang-pill-active-bg)] text-[var(--lang-pill-active-text)] shadow-sm'
                : 'text-[var(--lang-pill-text)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]'
            )}
          >
            {icon}
            <span className="hidden sm:inline">{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
