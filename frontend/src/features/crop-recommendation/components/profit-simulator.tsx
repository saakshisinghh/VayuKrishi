/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Calculator } from 'lucide-react';
import { ProfitComparisonTable } from './profit-comparison-table';
import { ProfitSimulatorSkeleton } from './recommendation-loading';
import type { ProfitSimulationResponse } from '../types/profit.types';
import { cn } from '@/lib/utils';

// ─── Chart Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(v);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-bold text-gray-800 dark:text-white">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Profit Simulator ─────────────────────────────────────────────────────────
interface ProfitSimulatorProps {
  data?: ProfitSimulationResponse;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

type ChartView = 'chart' | 'table';

export function ProfitSimulator({
  data,
  isLoading,
  isError,
  onRetry,
}: ProfitSimulatorProps) {
  const t = useTranslations('cropRecommendation.profitSimulator');
  const [view, setView] = useState<ChartView>('chart');

  if (isLoading) return <ProfitSimulatorSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900 dark:bg-rose-950/20">
        <p className="text-sm text-rose-600 dark:text-rose-400">{t('error')}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-rose-900/40 dark:text-rose-300"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.crops.map((c) => ({
    name: c.cropName,
    [t('rows.cost')]: c.inputCost,
    [t('rows.revenue')]: c.revenue,
    [t('rows.profit')]: c.profit,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/40">
            <Calculator className="h-4 w-4 text-violet-500" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
            <p className="text-xs text-gray-500">{t('subtitle')}</p>
          </div>
        </div>

        {/* View toggle */}
        <div
          className="flex items-center rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800"
          role="tablist"
          aria-label={t('viewToggle')}
        >
          {(['chart', 'table'] as ChartView[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500',
                view === v
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              )}
            >
              {t(`views.${v}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {view === 'chart' ? (
          <div style={{ height: 280 }} aria-label={t('chartAriaLabel')}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                role="img"
                aria-label={t('chartAriaLabel')}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('en-IN', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(v)
                  }
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                />
                <Bar
                  dataKey={t('rows.cost')}
                  fill="#fcd34d"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={t('rows.revenue')}
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={t('rows.profit')}
                  fill="#34d399"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ProfitComparisonTable crops={data.crops} bestCropId={data.bestCrop} />
        )}
      </div>
    </motion.div>
  );
}
