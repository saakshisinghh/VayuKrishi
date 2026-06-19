'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Activity,
  FlaskConical,
  Droplets,
  Eye,
  ChevronDown,
  CalendarDays,
  CloudSun,
  IndianRupee,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FarmPlanSkeleton } from './recommendation-loading';
import type { MonthlyPlan, FarmTask, TaskCategory } from '../types/farm-plan.types';
import type { FarmPlanResponse } from '../types/farm-plan.types';

// ─── Task Category Config ─────────────────────────────────────────────────────
const categoryConfig: Record<
  TaskCategory,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  activity: {
    icon: Activity,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    label: 'Activities',
  },
  fertilizer: {
    icon: FlaskConical,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    label: 'Fertilizer',
  },
  irrigation: {
    icon: Droplets,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    label: 'Irrigation',
  },
  monitoring: {
    icon: Eye,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    label: 'Monitoring',
  },
};

// ─── Task Item ────────────────────────────────────────────────────────────────
function TaskItem({ task }: { task: FarmTask }) {
  const config = categoryConfig[task.category];
  const Icon = config.icon;

  const priorityDot = {
    critical: 'bg-rose-500',
    high: 'bg-amber-500',
    medium: 'bg-blue-400',
    low: 'bg-gray-400',
  };

  return (
    <div className="flex items-start gap-2.5 py-2">
      <div
        className={cn('mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md', config.bg)}
        aria-hidden
      >
        <Icon className={cn('h-3.5 w-3.5', config.color)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', priorityDot[task.priority])}
            aria-label={`Priority: ${task.priority}`}
          />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</span>
          {task.cost && (
            <span className="ml-auto flex-shrink-0 text-xs text-gray-400">
              ₹{task.cost.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500">{task.description}</p>
      </div>
    </div>
  );
}

// ─── Month Card ───────────────────────────────────────────────────────────────
function MonthCard({ plan, index }: { plan: MonthlyPlan; index: number }) {
  const t = useTranslations('cropRecommendation.farmPlan');
  const [isOpen, setIsOpen] = useState(index === 0);

  const allTasks = [
    ...plan.activities,
    ...plan.fertilizerTasks,
    ...plan.irrigationTasks,
    ...plan.monitoringTasks,
  ];
  const taskCount = allTasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      {/* Month Header */}
      <button
        type="button"
        className="flex w-full items-center gap-4 bg-white px-5 py-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 dark:bg-gray-950 dark:hover:bg-gray-900"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={`month-${plan.month}-content`}
      >
        {/* Month number bubble */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
          {plan.monthName.slice(0, 3)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">{plan.monthName}</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800">
              {plan.cropStage}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
            <span>{t('tasks', { count: taskCount })}</span>
            {plan.estimatedCost > 0 && (
              <span className="flex items-center gap-0.5">
                <IndianRupee className="h-2.5 w-2.5" aria-hidden />
                {plan.estimatedCost.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      {/* Month Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`month-${plan.month}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="divide-y divide-gray-50 border-t border-gray-100 bg-white px-5 dark:divide-gray-900 dark:border-gray-800 dark:bg-gray-950">
              {/* Weather note */}
              {plan.weatherNote && (
                <div className="flex items-start gap-2 py-3">
                  <CloudSun className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" aria-hidden />
                  <p className="text-xs italic text-gray-500">{plan.weatherNote}</p>
                </div>
              )}

              {/* Tasks by category */}
              {(
                [
                  { tasks: plan.activities, category: 'activity' as TaskCategory },
                  { tasks: plan.fertilizerTasks, category: 'fertilizer' as TaskCategory },
                  { tasks: plan.irrigationTasks, category: 'irrigation' as TaskCategory },
                  { tasks: plan.monitoringTasks, category: 'monitoring' as TaskCategory },
                ] as const
              )
                .filter(({ tasks }) => tasks.length > 0)
                .map(({ tasks, category }) => {
                  const config = categoryConfig[category];
                  return (
                    <div key={category} className="py-3">
                      <div className={cn('mb-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider', config.color)}>
                        <config.icon className="h-3 w-3" aria-hidden />
                        {config.label}
                      </div>
                      <div className="divide-y divide-gray-50 dark:divide-gray-900">
                        {tasks.map((task) => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Farm Plan Timeline ───────────────────────────────────────────────────────
interface FarmPlanTimelineProps {
  data?: FarmPlanResponse;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function FarmPlanTimeline({
  data,
  isLoading,
  isError,
  onRetry,
}: FarmPlanTimelineProps) {
  const t = useTranslations('cropRecommendation.farmPlan');

  if (isLoading) return <FarmPlanSkeleton />;

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

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
      aria-label={t('ariaLabel', { cropName: data.cropName })}
    >
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
            <CalendarDays className="h-4 w-4 text-emerald-500" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
            <p className="text-xs text-gray-500">
              {t('subtitle', {
                cropName: data.cropName,
                months: data.durationMonths,
              })}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-3 flex gap-4">
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-800 dark:text-white">
              ₹{data.totalEstimatedCost.toLocaleString('en-IN')}
            </span>{' '}
            {t('totalCost')}
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-800 dark:text-white">
              {data.durationMonths}
            </span>{' '}
            {t('months')}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2 p-4">
        {data.monthlyPlans.map((plan, index) => (
          <MonthCard key={plan.month} plan={plan} index={index} />
        ))}
      </div>
    </div>
  );
}
