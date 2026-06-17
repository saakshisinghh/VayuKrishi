'use client';

import { useTranslations } from 'next-intl';
import { Leaf, Droplets, Bug, TrendingUp, Sprout } from 'lucide-react';
import type { HealthScoreBreakdown } from '../types/farm-health.types';

interface FarmHealthScoreCardProps {
  breakdown: HealthScoreBreakdown;
}

interface ScoreDimension {
  key: keyof HealthScoreBreakdown;
  labelKey: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  recommendation: string;
}

const dimensions: ScoreDimension[] = [
  {
    key: 'soilQuality',
    labelKey: 'scoreCard.soilQuality',
    icon: <Leaf className="h-4 w-4" />,
    color: '#10b981',
    bg: 'bg-emerald-500',
    recommendation: 'Add compost to improve further',
  },
  {
    key: 'waterEfficiency',
    labelKey: 'scoreCard.waterEfficiency',
    icon: <Droplets className="h-4 w-4" />,
    color: '#3b82f6',
    bg: 'bg-blue-500',
    recommendation: 'Consider drip irrigation',
  },
  {
    key: 'diseaseRisk',
    labelKey: 'scoreCard.diseaseRisk',
    icon: <Bug className="h-4 w-4" />,
    color: '#f59e0b',
    bg: 'bg-amber-500',
    recommendation: 'Apply preventive spray',
  },
  {
    key: 'marketPotential',
    labelKey: 'scoreCard.marketPotential',
    icon: <TrendingUp className="h-4 w-4" />,
    color: '#8b5cf6',
    bg: 'bg-violet-500',
    recommendation: 'Good selling opportunity',
  },
  {
    key: 'cropPerformance',
    labelKey: 'scoreCard.cropPerformance',
    icon: <Sprout className="h-4 w-4" />,
    color: '#06b6d4',
    bg: 'bg-cyan-500',
    recommendation: 'On track for season',
  },
];

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400' };
  if (score >= 65) return { label: 'Good', color: 'text-blue-400' };
  if (score >= 50) return { label: 'Fair', color: 'text-amber-400' };
  return { label: 'Needs Attention', color: 'text-red-400' };
}

export function FarmHealthScoreCard({ breakdown }: FarmHealthScoreCardProps) {
  const t = useTranslations('farmHealth');

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('scoreCard.title')}
    >
      <h2 className="mb-5 text-base font-semibold text-white">{t('scoreCard.title')}</h2>

      <div className="space-y-4">
        {dimensions.map((dim) => {
          const score = breakdown[dim.key];
          const { label, color } = getScoreLabel(score);

          return (
            <div key={dim.key} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80" style={{ color: dim.color }}>
                    {dim.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-300">{t(dim.labelKey)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${color}`}>{label}</span>
                  <span className="text-sm font-bold text-white">{score}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div
                className="relative h-2 overflow-hidden rounded-full bg-slate-800"
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${t(dim.labelKey)}: ${score}/100`}
              >
                <div
                  className={`h-full rounded-full ${dim.bg} transition-all duration-700`}
                  style={{ width: `${score}%`, opacity: 0.9 }}
                />
              </div>

              {/* Recommendation on hover */}
              <p className="mt-1 text-xs text-slate-600 transition-colors group-hover:text-slate-500">
                {dim.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
