'use client';

import { useTranslations } from 'next-intl';
import { Activity, TrendingUp, Shield, Zap, RefreshCw } from 'lucide-react';
import type { FarmHealthScore } from '../types/farm-health.types';

interface FarmHealthHeroProps {
  score: FarmHealthScore;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const riskColors: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-400/10',
  medium: 'text-amber-400 bg-amber-400/10',
  high: 'text-orange-400 bg-orange-400/10',
  critical: 'text-red-400 bg-red-400/10',
};

const riskLabels: Record<string, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

export function FarmHealthHero({ score, onRefresh, isRefreshing }: FarmHealthHeroProps) {
  const t = useTranslations('farmHealth');

  const scoreColor =
    score.overall >= 80
      ? '#10b981'
      : score.overall >= 60
      ? '#f59e0b'
      : score.overall >= 40
      ? '#f97316'
      : '#ef4444';

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score.overall / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1f0f] via-[#0d1f12] to-[#0a1a0a] border border-emerald-900/40 p-6 md:p-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-teal-500/5 blur-2xl" />
      </div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Title + Meta */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              {t('hero.subtitle')}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">{t('hero.title')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('hero.description')}</p>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-3">
            <StatPill
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label={t('hero.trend')}
              value={`+${score.trendValue}% ${t('hero.thisMonth')}`}
              className="text-emerald-400 bg-emerald-400/10"
            />
            <StatPill
              icon={<Shield className="h-3.5 w-3.5" />}
              label={t('hero.riskLevel')}
              value={riskLabels[score.riskLevel]}
              className={riskColors[score.riskLevel]}
            />
            <StatPill
              icon={<Zap className="h-3.5 w-3.5" />}
              label={t('hero.potential')}
              value={`+${score.improvementPotential}% ${t('hero.possibleGain')}`}
              className="text-violet-400 bg-violet-400/10"
            />
          </div>
        </div>

        {/* Right: Score ring */}
        <div className="flex items-center gap-5">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="relative z-10 text-center">
              <span className="block text-4xl font-black leading-none" style={{ color: scoreColor }}>
                {score.overall}
              </span>
              <span className="text-xs text-slate-400">{t('hero.outOf100')}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t('hero.farmHealthScore')}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {t('hero.lastUpdated')}{' '}
              {new Date(score.lastUpdated).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                aria-label={t('hero.refreshAnalysis')}
              >
                <RefreshCw
                  className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                {isRefreshing ? t('hero.analyzing') : t('hero.refreshAnalysis')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

function StatPill({ icon, label, value, className }: StatPillProps) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${className}`}>
      {icon}
      <span className="text-slate-400">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
