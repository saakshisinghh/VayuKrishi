'use client';

import { useTranslations } from 'next-intl';
import { Lightbulb, TrendingUp, Zap, Clock, IndianRupee } from 'lucide-react';
import type { ImprovementRecommendation } from '../types/farm-health.types';

interface FarmImprovementPanelProps {
  recommendations: ImprovementRecommendation[];
}

const difficultyStyles = {
  easy: { label: 'Easy', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  hard: { label: 'Hard', color: 'text-red-400', bg: 'bg-red-400/10' },
};

const categoryColors: Record<string, string> = {
  soil: '#f59e0b',
  water: '#3b82f6',
  disease: '#ef4444',
  market: '#8b5cf6',
  crop: '#10b981',
};

const categoryIcons: Record<string, string> = {
  soil: '🌱',
  water: '💧',
  disease: '🛡️',
  market: '📈',
  crop: '🌾',
};

export function FarmImprovementPanel({ recommendations }: FarmImprovementPanelProps) {
  const t = useTranslations('farmHealth');

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('improvements.title')}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
          <Lightbulb className="h-5 w-5 text-violet-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{t('improvements.title')}</h2>
          <p className="text-xs text-slate-500">{t('improvements.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const diff = difficultyStyles[rec.difficulty];
          const catColor = categoryColors[rec.category];
          const catIcon = categoryIcons[rec.category];

          return (
            <div
              key={rec.id}
              className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
              role="article"
              aria-label={rec.title}
            >
              {/* Rank badge */}
              <div
                className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-br-xl text-xs font-bold text-white"
                style={{ backgroundColor: catColor + '33', color: catColor }}
              >
                {index + 1}
              </div>

              <div className="ml-4">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-base">{catIcon}</span>
                  <h3 className="text-sm font-semibold text-white">{rec.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${diff.bg} ${diff.color}`}>
                    {diff.label}
                  </span>
                </div>

                <p className="mb-3 text-xs text-slate-500">{rec.description}</p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <TrendingUp className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                    <span>+{rec.expectedImpact}% impact</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <IndianRupee className="h-3 w-3 text-violet-400" aria-hidden="true" />
                    <span>₹{rec.estimatedBenefit.toLocaleString('en-IN')} benefit</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3 text-blue-400" aria-hidden="true" />
                    <span>{rec.timeToImplement}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total benefit */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-violet-500/5 border border-violet-500/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-violet-400" aria-hidden="true" />
          <span className="text-sm text-slate-300">{t('improvements.totalPotential')}</span>
        </div>
        <span className="text-base font-bold text-violet-400">
          ₹{recommendations.reduce((s, r) => s + r.estimatedBenefit, 0).toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}
