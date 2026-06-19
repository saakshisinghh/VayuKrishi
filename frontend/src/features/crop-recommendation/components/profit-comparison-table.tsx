'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee, ShieldCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CropProfitMetrics } from '../types/profit.types';

// ─── Risk Cell ────────────────────────────────────────────────────────────────
function RiskCell({ level }: { level: 'low' | 'medium' | 'high' }) {
  const t = useTranslations('cropRecommendation.risk');
  const config = {
    low: 'text-emerald-600 dark:text-emerald-400',
    medium: 'text-amber-600 dark:text-amber-400',
    high: 'text-rose-600 dark:text-rose-400',
  };

  const dots = { low: 1, medium: 2, high: 3 };

  return (
    <div className={cn('flex items-center gap-1.5 font-medium', config[level])}>
      {Array.from({ length: dots[level] }).map((_, i) => (
        <span key={i} className={cn('h-2 w-2 rounded-full', {
          'bg-emerald-500': level === 'low',
          'bg-amber-500': level === 'medium',
          'bg-rose-500': level === 'high',
        })} aria-hidden />
      ))}
      <span className="sr-only">{t(level)}</span>
      <span aria-hidden className="text-xs capitalize">{t(level)}</span>
    </div>
  );
}

// ─── Profit Comparison Table ──────────────────────────────────────────────────
interface ProfitComparisonTableProps {
  crops: CropProfitMetrics[];
  bestCropId?: string;
}

export function ProfitComparisonTable({ crops, bestCropId }: ProfitComparisonTableProps) {
  const t = useTranslations('cropRecommendation.profitSimulator');

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: amount >= 100000 ? 'compact' : 'standard',
    }).format(amount);

  const ROWS = [
    { key: 'inputCost', label: t('rows.cost'), format: fmt },
    { key: 'revenue', label: t('rows.revenue'), format: fmt },
    { key: 'profit', label: t('rows.profit'), format: fmt, highlight: true },
    {
      key: 'roi',
      label: t('rows.roi'),
      format: (v: number) => `${v}%`,
    },
    {
      key: 'riskLevel',
      label: t('rows.risk'),
      format: null,
      isRisk: true,
    },
  ] as const;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
      role="region"
      aria-label={t('ariaLabel')}
    >
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-emerald-500" aria-hidden />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
        </div>
        <p className="mt-0.5 text-xs text-gray-500">{t('subtitle')}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" aria-label={t('ariaLabel')}>
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                {t('headers.metric')}
              </th>
              {crops.map((crop) => (
                <th
                  key={crop.cropId}
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400"
                >
                  <div className="flex flex-col items-center gap-1">
                    {crop.cropId === bestCropId && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        <Award className="h-2.5 w-2.5" aria-hidden />
                        {t('bestChoice')}
                      </span>
                    )}
                    {crop.cropName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {ROWS.map((row, rowIndex) => (
              <motion.tr
                key={row.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.05 }}
                className={cn(
                  'transition-colors hover:bg-gray-50 dark:hover:bg-gray-900',
                  row.highlight && 'bg-emerald-50/50 dark:bg-emerald-950/20'
                )}
              >
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'text-sm',
                      row.highlight
                        ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {row.label}
                  </span>
                </td>

                {crops.map((crop) => (
                  <td
                    key={crop.cropId}
                    className={cn('px-4 py-4 text-center', {
                      'font-bold text-emerald-700 dark:text-emerald-400': row.highlight,
                    })}
                  >
                    {row.isRisk ? (
                      <div className="flex justify-center">
                        <RiskCell level={crop.riskLevel} />
                      </div>
                    ) : row.format ? (
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {row.format((crop as any)[row.key])}
                      </span>
                    ) : null}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
