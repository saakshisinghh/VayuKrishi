'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  FlaskConical,
  CloudSun,
  TrendingUp,
  MapPin,
  Droplets,
  Target,
  Sparkles,
} from 'lucide-react';
import type { RecommendationReason } from '../types/crop-recommendation.types';

// ─── Category Icon Map ────────────────────────────────────────────────────────
const categoryConfig = {
  soil: { icon: FlaskConical, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  weather: { icon: CloudSun, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30' },
  market: { icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
  regional: { icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  water: { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  goal: { icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
} as const;

// ─── Reason Item ──────────────────────────────────────────────────────────────
function ReasonItem({ reason, index }: { reason: RecommendationReason; index: number }) {
  const t = useTranslations('cropRecommendation.reasoning');
  const config = categoryConfig[reason.category];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="flex items-start gap-3"
      role="listitem"
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${config.bg}`}
        aria-hidden
      >
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {t(`categories.${reason.category}`)}
          </span>
          <span
            className="text-[10px] font-medium text-gray-400"
            aria-label={`${reason.weight}% weight`}
          >
            {reason.weight}%
          </span>
        </div>

        <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{reason.description}</p>

        {/* Weight bar */}
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.08 + 0.2, duration: 0.5 }}
            style={{ transformOrigin: 'left', width: `${reason.weight}%` }}
            className={`h-full rounded-full ${config.color.replace('text-', 'bg-')}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Reasoning Card ───────────────────────────────────────────────────────────
interface RecommendationReasoningCardProps {
  cropName: string;
  reasons: RecommendationReason[];
}

export function RecommendationReasoningCard({
  cropName,
  reasons,
}: RecommendationReasoningCardProps) {
  const t = useTranslations('cropRecommendation.reasoning');

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
      aria-label={t('ariaLabel', { cropName })}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
          <Sparkles className="h-4 w-4 text-emerald-500" aria-hidden />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('title')}
          </h3>
          <p className="text-xs text-gray-500">{t('subtitle', { cropName })}</p>
        </div>
      </div>

      {/* Reasons */}
      <ol className="space-y-4" role="list">
        {reasons.map((reason, index) => (
          <ReasonItem key={reason.id} reason={reason} index={index} />
        ))}
      </ol>
    </div>
  );
}
