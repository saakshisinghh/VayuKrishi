'use client';

import { useTranslations } from 'next-intl';
import { CalendarDays, Sprout, CheckSquare, Sparkles } from 'lucide-react';
import type { PlannerSummary } from '../types/planner.types';

interface PlannerHeroProps {
  summary: PlannerSummary;
}

const seasonConfig: Record<string, { label: string; emoji: string; color: string }> = {
  kharif: { label: 'Kharif Season', emoji: '🌧️', color: 'text-blue-400' },
  rabi: { label: 'Rabi Season', emoji: '☀️', color: 'text-amber-400' },
  zaid: { label: 'Zaid Season', emoji: '🌞', color: 'text-orange-400' },
  summer: { label: 'Summer', emoji: '🌡️', color: 'text-red-400' },
};

export function PlannerHero({ summary }: PlannerHeroProps) {
  const t = useTranslations('planner');
  const season = seasonConfig[summary.currentSeason] ?? seasonConfig.kharif;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1a10] via-[#0a1a12] to-[#081510] border border-teal-900/40 p-6 md:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-teal-500/6 blur-3xl" />
        <div className="absolute -bottom-8 left-4 h-40 w-40 rounded-full bg-emerald-500/6 blur-2xl" />
      </div>

      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-teal-400" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            {t('hero.subtitle')}
          </span>
        </div>
        <h1 className="mb-1 text-2xl font-bold text-white md:text-3xl">{t('hero.title')}</h1>
        <p className="mb-5 text-sm text-slate-400">{t('hero.description')}</p>

        {/* Season + month */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2">
            <span className="text-xl">{season.emoji}</span>
            <div>
              <p className={`text-sm font-bold ${season.color}`}>{season.label}</p>
              <p className="text-xs text-slate-500">{summary.currentMonth}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-teal-500/10 border border-teal-500/20 px-3 py-2">
            <Sparkles className="h-4 w-4 text-teal-400" aria-hidden="true" />
            <p className="text-sm font-medium text-teal-300">{summary.nextMajorActivity}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MiniStat
            icon={<CheckSquare className="h-4 w-4 text-emerald-400" />}
            label={t('hero.completion')}
            value={`${summary.completionRate}%`}
            color="bg-emerald-500/10 border-emerald-500/20"
          />
          <MiniStat
            icon={<CalendarDays className="h-4 w-4 text-blue-400" />}
            label={t('hero.upcomingTasks')}
            value={summary.upcomingTasksCount.toString()}
            color="bg-blue-500/10 border-blue-500/20"
          />
          <MiniStat
            icon={<Sparkles className="h-4 w-4 text-amber-400" />}
            label={t('hero.aiSuggestions')}
            value={summary.aiSuggestionsCount.toString()}
            color="bg-amber-500/10 border-amber-500/20"
          />
          <MiniStat
            icon={<Sprout className="h-4 w-4 text-teal-400" />}
            label={t('hero.season')}
            value={season.label}
            color="bg-teal-500/10 border-teal-500/20"
          />
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl border p-3 ${color}`}>
      <div className="mb-1">{icon}</div>
      <p className="text-sm font-bold text-white truncate">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
