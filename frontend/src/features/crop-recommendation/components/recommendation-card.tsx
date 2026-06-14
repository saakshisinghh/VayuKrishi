'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  IndianRupee,
  Wheat,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CropRecommendation } from '../types/crop-recommendation.types';

// ─── Risk Badge ───────────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: CropRecommendation['riskLevel'] }) {
  const t = useTranslations('cropRecommendation.risk');
  const config = {
    low: { className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', label: t('low') },
    medium: { className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', label: t('medium') },
    high: { className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', label: t('high') },
  };
  const { className, label } = config[level];

  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', className)}
      aria-label={`Risk: ${label}`}
    >
      <ShieldCheck className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

// ─── Market Trend Icon ────────────────────────────────────────────────────────
function MarketTrendIcon({ trend }: { trend: CropRecommendation['marketTrend'] }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-emerald-500" aria-label="Market trending up" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-rose-500" aria-label="Market trending down" />;
  return <Minus className="h-4 w-4 text-gray-400" aria-label="Market stable" />;
}

// ─── Confidence Ring ──────────────────────────────────────────────────────────
function ConfidenceRing({ value }: { value: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div className="relative flex h-14 w-14 items-center justify-center" aria-label={`${value}% confidence`}>
      <svg className="absolute -rotate-90" width="56" height="56" aria-hidden>
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-100 dark:text-gray-800"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          className="text-emerald-500 transition-all duration-700"
        />
      </svg>
      <span className="text-xs font-bold text-gray-800 dark:text-white">{value}%</span>
    </div>
  );
}

// ─── Crop Recommendation Card ─────────────────────────────────────────────────
interface RecommendationCardProps {
  recommendation: CropRecommendation;
  index: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function CropRecommendationCard({
  recommendation,
  index,
  isSelected,
  onSelect,
}: RecommendationCardProps) {
  const t = useTranslations('cropRecommendation');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: amount >= 100000 ? 'compact' : 'standard',
    }).format(amount);

  const isTopPick = recommendation.rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <button
        type="button"
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-gray-950',
          isSelected
            ? 'border-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/20'
            : 'border-gray-200 hover:border-gray-300 dark:border-gray-800',
          isTopPick && 'ring-1 ring-emerald-300 dark:ring-emerald-800'
        )}
        onClick={() => onSelect?.(recommendation.id)}
        aria-pressed={isSelected}
        aria-label={`${recommendation.cropName}, Rank ${recommendation.rank}, ${formatCurrency(recommendation.expectedProfit)} profit`}
      >
        {/* Top pick ribbon */}
        {isTopPick && (
          <div
            className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
            aria-label="Top recommendation"
          >
            <Award className="h-3 w-3" aria-hidden />
            {t('card.topPick')}
          </div>
        )}

        {/* Rank */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                recommendation.rank === 1
                  ? 'bg-emerald-500 text-white'
                  : recommendation.rank === 2
                    ? 'bg-amber-400 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              )}
              aria-hidden
            >
              #{recommendation.rank}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {recommendation.cropName}
              </h3>
              <p className="text-xs text-gray-500">{recommendation.cropNameLocal}</p>
            </div>
          </div>

          <ConfidenceRing value={recommendation.confidence} />
        </div>

        {/* Stats grid */}
        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
            <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-400">
              <Wheat className="h-3 w-3" aria-hidden />
              {t('card.yield')}
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-white">
              {recommendation.expectedYield.toLocaleString('en-IN')} kg
              <span className="ml-1 text-[10px] font-normal text-gray-400">/ {t('card.perAcre')}</span>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
            <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-400">
              <IndianRupee className="h-3 w-3" aria-hidden />
              {t('card.revenue')}
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-white">
              {formatCurrency(recommendation.expectedRevenue)}
            </div>
          </div>

          <div className="col-span-2 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
            <div className="mb-1 text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t('card.estimatedProfit')}
            </div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(recommendation.expectedProfit)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <RiskBadge level={recommendation.riskLevel} />

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MarketTrendIcon trend={recommendation.marketTrend} />
            {t(`card.marketTrend.${recommendation.marketTrend}`)}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
