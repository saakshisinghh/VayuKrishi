'use client';

import { useTranslations } from 'next-intl';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { HealthTrendPoint } from '../types/farm-health.types';

interface HealthTrendChartProps {
  trend: HealthTrendPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
      <p className="mb-1.5 text-xs font-semibold text-slate-300">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-400 capitalize">{p.name}:</span>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function HealthTrendChart({ trend }: HealthTrendChartProps) {
  const t = useTranslations('farmHealth');

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('trend.title')}
    >
      <h2 className="mb-1 text-base font-semibold text-white">{t('trend.title')}</h2>
      <p className="mb-5 text-xs text-slate-500">{t('trend.subtitle')}</p>

      <div aria-label={t('trend.chartDescription')}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Overall"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="soilScore"
              name="Soil"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }}
              strokeDasharray="4 2"
            />
            <Line
              type="monotone"
              dataKey="waterScore"
              name="Water"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
              strokeDasharray="4 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
