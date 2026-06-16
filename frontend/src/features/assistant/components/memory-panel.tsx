'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FarmerMemory } from '../types/memory.types';
import { MemoryInsightCard } from './memory-insight-card';

interface MemoryPanelProps {
  memory: FarmerMemory | null;
  isLoading: boolean;
  locale: string;
  isOpen: boolean;
  onToggle: () => void;
}

const SoilBadge: React.FC<{ soil: string }> = ({ soil }) => (
  <span className="inline-block text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5">
    🌍 {soil}
  </span>
);

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  memory,
  isLoading,
  locale,
  isOpen,
  onToggle,
}) => {
  const t = useTranslations('assistant');
  const useLocal = ['mr', 'hi', 'gu', 'ta', 'kn'].includes(locale);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Panel header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
        aria-expanded={isOpen}
        aria-label={t('memory.panelTitle')}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🧠</span>
          <span className="text-sm font-semibold text-zinc-200">{t('memory.panelTitle')}</span>
          {memory && (
            <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-1.5 py-0.5">
              {t('memory.active')}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel body */}
      {isOpen && (
        <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
          {isLoading ? (
            <MemorySkeleton />
          ) : memory ? (
            <>
              {/* Farmer profile */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {memory.profile.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {useLocal && memory.profile.nameLocal
                      ? memory.profile.nameLocal
                      : memory.profile.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    📍 {memory.profile.location.village}, {memory.profile.location.district}
                  </p>
                </div>
              </div>

              {/* Farm details */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
                  <p className="text-xs text-zinc-500">{t('memory.farmSize')}</p>
                  <p className="text-sm font-semibold text-white">
                    {memory.profile.farmSize} {memory.profile.farmSizeUnit}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
                  <p className="text-xs text-zinc-500">{t('memory.soilType')}</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {useLocal && memory.profile.soilTypeLocal
                      ? memory.profile.soilTypeLocal
                      : memory.profile.soilType}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
                  <p className="text-xs text-zinc-500">{t('memory.currentCrop')}</p>
                  <p className="text-sm font-semibold text-emerald-400">
                    {(useLocal && memory.currentCropLocal) || memory.currentCrop || '—'}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
                  <p className="text-xs text-zinc-500">{t('memory.language')}</p>
                  <p className="text-sm font-semibold text-blue-400 uppercase">
                    {memory.profile.preferredLanguage}
                  </p>
                </div>
              </div>

              {/* Memory insights */}
              {memory.insights.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-2">{t('memory.insights')}</p>
                  <div className="space-y-2">
                    {memory.insights.map((insight) => (
                      <MemoryInsightCard
                        key={insight.id}
                        insight={insight}
                        locale={locale}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Session count */}
              <div className="text-xs text-zinc-600 text-center pt-1">
                {t('memory.sessions', { count: memory.totalSessions })}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-500">{t('memory.noMemory')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MemorySkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-zinc-800" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
        <div className="h-2.5 bg-zinc-800 rounded w-1/2" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 bg-zinc-800 rounded-lg" />
      ))}
    </div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 bg-zinc-800 rounded-lg" />
      ))}
    </div>
  </div>
);

export default MemoryPanel;
