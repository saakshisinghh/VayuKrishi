'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import type { TaskProgress } from '../types/planner.types';

interface TaskProgressCardProps {
  progress: TaskProgress;
}

const categoryLabels: Record<string, string> = {
  sowing: 'Sowing',
  fertilizer: 'Fertilizer',
  irrigation: 'Irrigation',
  monitoring: 'Monitoring',
  harvesting: 'Harvest',
  pest_control: 'Pest',
  soil_prep: 'Soil',
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#6b7280'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-2.5 shadow-xl">
      <p className="text-xs font-semibold text-white">{label}</p>
      <p className="text-xs text-emerald-400">{payload[0].value}% done</p>
    </div>
  );
}

export function TaskProgressCard({ progress }: TaskProgressCardProps) {
  const t = useTranslations('planner');

  const chartData = progress.categoryBreakdown.map((c) => ({
    name: categoryLabels[c.category] ?? c.category,
    percent: c.percent,
    category: c.category,
  }));

  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (progress.completionPercent / 100) * circumference;

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('progress.title')}
    >
      <h2 className="mb-5 text-base font-semibold text-white">{t('progress.title')}</h2>

      {/* Overall progress ring + stats */}
      <div className="mb-5 flex items-center gap-5">
        {/* Ring */}
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
          <svg className="-rotate-90" viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#1f2937" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute text-center">
            <span className="block text-lg font-black text-white">{progress.completionPercent}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid flex-1 grid-cols-2 gap-2">
          <StatChip
            icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            label={t('progress.completed')}
            value={progress.completedTasks}
            color="text-emerald-400"
          />
          <StatChip
            icon={<Clock className="h-3.5 w-3.5 text-amber-400" />}
            label={t('progress.pending')}
            value={progress.pendingTasks}
            color="text-amber-400"
          />
          <StatChip
            icon={<AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
            label={t('progress.overdue')}
            value={progress.overdueTasks}
            color="text-red-400"
          />
          <StatChip
            icon={<Calendar className="h-3.5 w-3.5 text-blue-400" />}
            label={t('progress.upcoming')}
            value={progress.upcomingTasks}
            color="text-blue-400"
          />
        </div>
      </div>

      {/* Category breakdown chart */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {t('progress.byCategory')}
      </p>
      <div aria-label="Task completion by category chart">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-slate-800/40 px-2.5 py-2">
      <div className="mb-0.5 flex items-center gap-1">{icon}</div>
      <p className={`text-base font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}
