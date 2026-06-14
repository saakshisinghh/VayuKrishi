'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  FlaskConical,
  CloudSun,
  TrendingUp,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

// ─── Processing Stages ────────────────────────────────────────────────────────
const STAGES = [
  { key: 'analyzing_soil', icon: FlaskConical, color: 'text-amber-500', delay: 0 },
  { key: 'checking_weather', icon: CloudSun, color: 'text-sky-500', delay: 900 },
  { key: 'analyzing_market', icon: TrendingUp, color: 'text-violet-500', delay: 1800 },
  { key: 'calculating_risks', icon: ShieldAlert, color: 'text-rose-500', delay: 2700 },
  { key: 'generating_recommendations', icon: Sparkles, color: 'text-emerald-500', delay: 3600 },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export function RecommendationLoading() {
  const t = useTranslations('cropRecommendation.loading');
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((stage, index) => {
      // Activate stage
      timers.push(
        setTimeout(() => {
          setActiveStage(index);
        }, stage.delay)
      );

      // Complete stage (just before next starts)
      if (index < STAGES.length - 1) {
        timers.push(
          setTimeout(() => {
            setCompletedStages((prev) => [...prev, index]);
          }, stage.delay + 700)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="flex min-h-[420px] flex-col items-center justify-center gap-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-teal-950/40"
      role="status"
      aria-label={t('ariaLabel')}
      aria-live="polite"
    >
      {/* Central pulsing orb */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Outer ring pulses */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-full w-full rounded-full border border-emerald-300 dark:border-emerald-700"
            animate={{ scale: [1, 1.4 + i * 0.2], opacity: [0.6, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Core icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute h-full w-full rounded-full border-2 border-dashed border-emerald-300 dark:border-emerald-700"
        />

        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg shadow-emerald-200 dark:bg-gray-900 dark:shadow-emerald-900/40">
          <Sparkles className="h-7 w-7 text-emerald-500" aria-hidden />
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
        <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      {/* Stage list */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = activeStage === index;
          const isDone = completedStages.includes(index);
          const isPending = index > activeStage;

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center gap-3"
              aria-hidden={isPending}
            >
              {/* Icon */}
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  isDone
                    ? 'bg-emerald-100 dark:bg-emerald-900/40'
                    : isActive
                      ? 'bg-white shadow dark:bg-gray-800'
                      : 'bg-gray-100 dark:bg-gray-800/50'
                }`}
              >
                {isActive && !isDone ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  >
                    <Icon className={`h-4 w-4 ${stage.color}`} aria-hidden />
                  </motion.div>
                ) : (
                  <Icon
                    className={`h-4 w-4 ${isDone ? 'text-emerald-500' : 'text-gray-400'}`}
                    aria-hidden
                  />
                )}
              </div>

              {/* Label */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${stage.key}-${isActive}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-gray-900 dark:text-white'
                      : isDone
                        ? 'text-emerald-600 line-through dark:text-emerald-400'
                        : 'text-gray-400'
                  }`}
                >
                  {t(`stages.${stage.key}`)}
                </motion.span>
              </AnimatePresence>

              {/* Done check */}
              {isDone && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-emerald-500"
                  aria-label="completed"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min(100, ((activeStage + 1) / STAGES.length) * 100)}%`,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          role="progressbar"
          aria-valuenow={Math.round(((activeStage + 1) / STAGES.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function RecommendationSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3" aria-busy="true" aria-label="Loading recommendations">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
      ))}
    </div>
  );
}

export function ProfitSimulatorSkeleton() {
  return (
    <div className="h-56 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" aria-busy="true" />
  );
}

export function FarmPlanSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      ))}
    </div>
  );
}
