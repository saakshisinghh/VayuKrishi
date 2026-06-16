'use client';

import React from 'react';
import { AssistantContext } from '../types/assistant.types';
import { useTranslations } from 'next-intl';

interface ContextCardProps {
  context: AssistantContext;
}

interface ContextItem {
  key: keyof AssistantContext;
  labelKey: string;
  icon: string;
}

const CONTEXT_ITEMS: ContextItem[] = [
  { key: 'usedFarmLocation', labelKey: 'context.farmLocation', icon: '📍' },
  { key: 'usedSoilType', labelKey: 'context.soilType', icon: '🌍' },
  { key: 'usedPreviousCrop', labelKey: 'context.previousCrop', icon: '🌾' },
  { key: 'usedDiseaseHistory', labelKey: 'context.diseaseHistory', icon: '🦠' },
  { key: 'usedWeatherData', labelKey: 'context.weatherData', icon: '🌤️' },
  { key: 'usedMarketData', labelKey: 'context.marketData', icon: '📊' },
];

export const ContextCard: React.FC<ContextCardProps> = ({ context }) => {
  const t = useTranslations('assistant');
  const usedItems = CONTEXT_ITEMS.filter((item) => context[item.key]);

  if (usedItems.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg bg-zinc-800/60 border border-zinc-700/40 px-3 py-2.5">
      <p className="text-xs text-zinc-500 mb-2 font-medium">{t('context.usedFor')}</p>
      <div className="flex flex-wrap gap-1.5">
        {usedItems.map((item) => (
          <span
            key={item.key}
            className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {item.icon} {t(item.labelKey as any)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ContextCard;
