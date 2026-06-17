'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, ArrowRight, IndianRupee } from 'lucide-react';
import type { SchemeRecommendation } from '../types/scheme.types';

interface SchemeRecommendationPanelProps {
  recommendations: SchemeRecommendation[];
  onSelectScheme?: (schemeId: string) => void;
}

const priorityConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/20', label: 'High Priority' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/20', label: 'Medium' },
  low: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/20', label: 'Low' },
};

export function SchemeRecommendationPanel({ recommendations, onSelectScheme }: SchemeRecommendationPanelProps) {
  const t = useTranslations('schemes');

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('recommendations.title')}
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
          <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{t('recommendations.title')}</h2>
          <p className="text-xs text-slate-500">{t('recommendations.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const pCfg = priorityConfig[rec.priority];

          return (
            <div
              key={rec.scheme.id}
              className={`rounded-xl border ${pCfg.border} bg-slate-900/60 p-4`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{rec.scheme.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pCfg.bg} ${pCfg.color}`}>
                  {pCfg.label}
                </span>
              </div>

              {/* Why recommended */}
              <ul className="mb-3 space-y-1">
                {rec.whyRecommended.map((reason, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-amber-500">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  <span className="text-sm font-bold text-emerald-400">
                    ₹{rec.potentialBenefit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500">potential benefit</span>
                </div>
                {onSelectScheme && (
                  <button
                    onClick={() => onSelectScheme(rec.scheme.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                  >
                    {rec.actionRequired}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
