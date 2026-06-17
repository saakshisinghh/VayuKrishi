'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import type { SeasonalPlan, MonthlyPlan } from '../types/planner.types';

interface SeasonalTimelineProps {
  plan: SeasonalPlan;
  onSelectMonth?: (month: MonthlyPlan) => void;
}

const currentMonth = new Date().getMonth() + 1;

const seasonColors: Record<string, string> = {
  kharif: 'border-blue-500/40 bg-blue-500/5',
  rabi: 'border-amber-500/40 bg-amber-500/5',
  zaid: 'border-orange-500/40 bg-orange-500/5',
  summer: 'border-red-500/40 bg-red-500/5',
};

const seasonActiveColors: Record<string, string> = {
  kharif: 'border-blue-400 bg-blue-400/10 ring-2 ring-blue-400/30',
  rabi: 'border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/30',
  zaid: 'border-orange-400 bg-orange-400/10 ring-2 ring-orange-400/30',
  summer: 'border-red-400 bg-red-400/10 ring-2 ring-red-400/30',
};

const seasonTextColors: Record<string, string> = {
  kharif: 'text-blue-400',
  rabi: 'text-amber-400',
  zaid: 'text-orange-400',
  summer: 'text-red-400',
};

export function SeasonalTimeline({ plan, onSelectMonth }: SeasonalTimelineProps) {
  const t = useTranslations('planner');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const handleSelect = (m: MonthlyPlan) => {
    setSelectedMonth(m.month);
    onSelectMonth?.(m);
  };

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('timeline.title')}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">{t('timeline.title')}</h2>
          <p className="text-xs text-slate-500">{plan.season.charAt(0).toUpperCase() + plan.season.slice(1)} {plan.year}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <span className="font-medium text-white">{plan.primaryCrops.join(', ')}</span>
        </div>
      </div>

      {/* Scrollable timeline */}
      <div className="overflow-x-auto pb-2" role="list" aria-label="Monthly timeline">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {plan.months.map((month) => {
            const isCurrentMonth = month.month === currentMonth;
            const isSelected = selectedMonth === month.month;
            const hasAlert = !!month.weatherAlert;
            const colorClass =
              isCurrentMonth || isSelected
                ? seasonActiveColors[month.season]
                : seasonColors[month.season];
            const textColor = seasonTextColors[month.season];

            return (
              <button
                key={month.month}
                onClick={() => handleSelect(month)}
                className={`w-32 flex-shrink-0 rounded-xl border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${colorClass}`}
                role="listitem"
                aria-label={`${month.monthName}: ${month.tasks.length} tasks, ${month.keyActivity}`}
                aria-pressed={isSelected}
              >
                {/* Month name */}
                <div className="mb-2 flex items-center justify-between">
                  <p className={`text-sm font-bold ${isCurrentMonth ? textColor : 'text-white'}`}>
                    {month.monthName}
                  </p>
                  {isCurrentMonth && (
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${textColor} bg-current/10`} style={{ fontSize: '9px' }}>
                      NOW
                    </span>
                  )}
                </div>

                {/* Key activity */}
                <p className="mb-2 text-xs leading-snug text-slate-400">{month.keyActivity}</p>

                {/* Task count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{month.tasks.length} tasks</span>
                  {hasAlert && (
                    <AlertTriangle className="h-3 w-3 text-amber-400" aria-label="Weather alert" />
                  )}
                </div>

                {/* AI suggestions pill */}
                {month.aiSuggestions.length > 0 && (
                  <div className="mt-1.5 rounded-md bg-teal-500/10 px-1.5 py-0.5 text-xs text-teal-400">
                    {month.aiSuggestions.length} AI tips
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400" />Kharif</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />Rabi</span>
        <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-amber-400" />Weather Alert</span>
      </div>
    </div>
  );
}
