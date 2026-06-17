'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle, XCircle, ChevronRight } from 'lucide-react';
import type { EligibilityScore } from '../types/scheme.types';

interface EligibilityScoreCardProps {
  scores: EligibilityScore[];
  onSelectScheme?: (schemeId: string) => void;
}

const statusConfig = {
  eligible: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Eligible',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-500/20',
    ring: 'ring-emerald-500/20',
  },
  partially_eligible: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Partial',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-500/20',
    ring: 'ring-amber-500/20',
  },
  ineligible: {
    icon: <XCircle className="h-4 w-4" />,
    label: 'Not Eligible',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-500/20',
    ring: 'ring-red-500/20',
  },
  applied: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Applied',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-500/20',
    ring: 'ring-blue-500/20',
  },
  approved: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Approved',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-500/20',
    ring: 'ring-violet-500/20',
  },
  rejected: {
    icon: <XCircle className="h-4 w-4" />,
    label: 'Rejected',
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    border: 'border-slate-500/20',
    ring: 'ring-slate-500/20',
  },
};

export function EligibilityScoreCard({ scores, onSelectScheme }: EligibilityScoreCardProps) {
  const t = useTranslations('schemes');

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('eligibility.title')}
    >
      <h2 className="mb-5 text-base font-semibold text-white">{t('eligibility.title')}</h2>

      <div className="space-y-3">
        {scores.map((score) => {
          const cfg = statusConfig[score.status] ?? statusConfig.eligible;

          return (
            <button
              key={score.schemeId}
              onClick={() => onSelectScheme?.(score.schemeId)}
              className={`w-full rounded-xl border p-4 text-left transition-all hover:border-slate-600 focus:outline-none focus:ring-2 ${cfg.border} ${cfg.ring} bg-slate-900/50`}
              aria-label={`${score.schemeName} — ${cfg.label} — ${score.eligibilityPercent}% match`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">{score.schemeName}</h3>
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </div>

                  {/* Match score bar */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${score.eligibilityPercent}%`,
                          backgroundColor: cfg.color.replace('text-', '').includes('emerald') ? '#10b981' : '#f59e0b',
                        }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${cfg.color}`}>{score.eligibilityPercent}%</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Benefit: <span className="font-medium text-slate-300">₹{score.potentialBenefit.toLocaleString('en-IN')}</span>
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-600 group-hover:text-slate-400" aria-hidden="true" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
