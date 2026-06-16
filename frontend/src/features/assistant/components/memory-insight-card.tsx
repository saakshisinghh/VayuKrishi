'use client';

import React from 'react';
import { MemoryInsight } from '../types/memory.types';
import { useTranslations } from 'next-intl';

interface MemoryInsightCardProps {
  insight: MemoryInsight;
  locale: string;
}

const COLOR_MAP: Record<string, string> = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  red: 'bg-red-500/10 border-red-500/20 text-red-400',
};

export const MemoryInsightCard: React.FC<MemoryInsightCardProps> = ({
  insight,
  locale,
}) => {
  const t = useTranslations('assistant');
  const colorClass = COLOR_MAP[insight.color] ?? COLOR_MAP.blue;
  const displayValue = ['mr', 'hi', 'gu', 'ta', 'kn'].includes(locale) && insight.valueLocal
    ? insight.valueLocal
    : insight.value;

  return (
    <div className={`rounded-lg border px-3 py-2.5 ${colorClass}`}>
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs opacity-70 truncate">{t(insight.labelKey as any)}</p>
          <p className="text-sm font-semibold truncate">{displayValue}</p>
        </div>
      </div>
      {insight.date && (
        <p className="text-xs opacity-50 mt-1">
          {new Date(insight.date).toLocaleDateString(locale, {
            month: 'short',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
};

export default MemoryInsightCard;
