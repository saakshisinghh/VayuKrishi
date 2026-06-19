'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CloudLightning, Bug, TrendingDown, Droplets, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CropRecommendation } from '../types/crop-recommendation.types';

// ─── Risk data derived from recommendation ────────────────────────────────────
function deriveRisks(riskLevel: CropRecommendation['riskLevel']) {
  const base = { low: 0, medium: 1, high: 2 };
  const level = base[riskLevel];

  return [
    {
      key: 'weather',
      icon: CloudLightning,
      level: level === 0 ? 'low' : level === 1 ? 'medium' : 'high',
    },
    {
      key: 'disease',
      icon: Bug,
      level: level === 0 ? 'low' : level === 2 ? 'high' : 'medium',
    },
    {
      key: 'market',
      icon: TrendingDown,
      level: level === 2 ? 'high' : 'medium',
    },
    {
      key: 'water',
      icon: Droplets,
      level: level === 0 ? 'low' : 'medium',
    },
  ] as const;
}

// ─── Risk Bar ─────────────────────────────────────────────────────────────────
type RiskLevel = 'low' | 'medium' | 'high';

const riskConfig: Record<
  RiskLevel,
  { label: string; width: string; barColor: string; textColor: string }
> = {
  low: {
    label: '',
    width: 'w-1/3',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  medium: {
    label: '',
    width: 'w-2/3',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  high: {
    label: '',
    width: 'w-full',
    barColor: 'bg-rose-500',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
};

// ─── Risk Analysis Card ───────────────────────────────────────────────────────
interface RiskAnalysisCardProps {
  recommendation: CropRecommendation;
}

export function RiskAnalysisCard({ recommendation }: RiskAnalysisCardProps) {
  const t = useTranslations('cropRecommendation.riskAnalysis');
  const risks = deriveRisks(recommendation.riskLevel);

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
      aria-label={t('ariaLabel', { cropName: recommendation.cropName })}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/40">
          <ShieldAlert className="h-4 w-4 text-rose-500" aria-hidden />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
          <p className="text-xs text-gray-500">{t('subtitle', { cropName: recommendation.cropName })}</p>
        </div>
      </div>

      {/* Risk rows */}
      <div className="space-y-4" role="list">
        {risks.map((risk, index) => {
          const Icon = risk.icon;
          const config = riskConfig[risk.level];
          const tKey = risk.level as RiskLevel;

          return (
            <motion.div
              key={risk.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              role="listitem"
              aria-label={`${t(`types.${risk.key}`)}: ${t(`levels.${tKey}`)}`}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-400" aria-hidden />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t(`types.${risk.key}`)}
                  </span>
                </div>
                <span className={cn('text-xs font-semibold', config.textColor)}>
                  {t(`levels.${tKey}`)}
                </span>
              </div>

              {/* Bar */}
              <div
                className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                role="presentation"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.07 + 0.2, duration: 0.5, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                  className={cn('h-full rounded-full', config.barColor, config.width)}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall risk summary */}
      <div className="mt-5 rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
        <p className="text-xs text-gray-500">
          {t('overallNote', {
            level: t(`levels.${recommendation.riskLevel}`),
            cropName: recommendation.cropName,
          })}
        </p>
      </div>
    </div>
  );
}
