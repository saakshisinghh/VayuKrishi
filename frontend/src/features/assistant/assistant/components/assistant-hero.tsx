'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AssistantStatus, AssistantLanguage } from '../types/assistant.types';

const LANGUAGE_LABELS: Record<AssistantLanguage, string> = {
  en: 'English',
  mr: 'मराठी',
  hi: 'हिंदी',
  gu: 'ગુજરાતી',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ',
};

interface AssistantHeroProps {
  status: AssistantStatus;
  language: AssistantLanguage;
  memoryEnabled: boolean;
  messageCount: number;
}

const StatusDot: React.FC<{ status: AssistantStatus }> = ({ status }) => {
  const colorMap: Record<AssistantStatus, string> = {
    online: 'bg-emerald-400',
    offline: 'bg-zinc-400',
    thinking: 'bg-amber-400 animate-pulse',
    speaking: 'bg-blue-400 animate-pulse',
  };
  const labelMap: Record<AssistantStatus, string> = {
    online: 'Online',
    offline: 'Offline',
    thinking: 'Thinking...',
    speaking: 'Speaking...',
  };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block w-2 h-2 rounded-full ${colorMap[status]}`} />
      <span className="text-xs font-medium text-zinc-400">{labelMap[status]}</span>
    </div>
  );
};

export const AssistantHero: React.FC<AssistantHeroProps> = ({
  status,
  language,
  memoryEnabled,
  messageCount,
}) => {
  const t = useTranslations('assistant');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 px-6 py-8 mb-6">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: identity */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-2xl">🌾</span>
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${
                status === 'offline' ? 'bg-zinc-400' : 'bg-emerald-400'
              }`}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5 max-w-xs leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Right: badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
            </svg>
            {t('hero.aiBadge')}
          </span>

          {/* Language badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
            🌐 {LANGUAGE_LABELS[language]}
          </span>

          {/* Memory badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
              memoryEnabled
                ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                : 'bg-zinc-800 border-zinc-700 text-zinc-500'
            }`}
          >
            🧠 {memoryEnabled ? t('hero.memoryOn') : t('hero.memoryOff')}
          </span>

          {/* Status */}
          <span className="inline-flex items-center rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1">
            <StatusDot status={status} />
          </span>
        </div>
      </div>

      {/* Stat strip */}
      {messageCount > 0 && (
        <div className="mt-5 pt-5 border-t border-zinc-800 flex items-center gap-6">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{messageCount}</div>
            <div className="text-xs text-zinc-500">{t('hero.messages')}</div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">24</div>
            <div className="text-xs text-zinc-500">{t('hero.sessions')}</div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center">
            <div className="text-lg font-bold text-white">3</div>
            <div className="text-xs text-zinc-500">{t('hero.crops')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantHero;
