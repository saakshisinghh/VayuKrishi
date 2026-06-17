'use client';

import { useTranslations } from 'next-intl';
import { Brain, TrendingUp, ShieldCheck, IndianRupee, Zap, Clock } from 'lucide-react';
import type { AIFarmPlan } from '../types/planner.types';

interface AIFarmPlanCardProps {
  plan: AIFarmPlan;
}

const urgencyConfig = {
  urgent: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/20', dot: 'bg-red-400' },
  high: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-500/20', dot: 'bg-orange-400' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  low: { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-600', dot: 'bg-slate-400' },
};

export function AIFarmPlanCard({ plan }: AIFarmPlanCardProps) {
  const t = useTranslations('planner');

  return (
    <div
      className="rounded-2xl border border-teal-900/40 bg-gradient-to-br from-[#0a1a14] to-[#0d1117] p-6"
      role="region"
      aria-label={t('aiPlan.title')}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15">
            <Brain className="h-5 w-5 text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{t('aiPlan.title')}</h2>
            <p className="text-xs text-slate-500">{t('aiPlan.subtitle')}</p>
          </div>
        </div>
        <div className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-400">
          {plan.confidence}% confidence
        </div>
      </div>

      {/* Outcome summary */}
      <div className="mb-5 rounded-xl bg-slate-800/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t('aiPlan.expectedOutcome')}
        </p>
        <p className="text-sm font-medium text-white">{plan.expectedOutcome}</p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2.5">
            <div className="mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-xs text-slate-500">{t('aiPlan.riskReduction')}</span>
            </div>
            <p className="text-lg font-black text-emerald-400">-{plan.riskReduction}%</p>
          </div>
          <div className="rounded-lg bg-violet-500/5 border border-violet-500/10 p-2.5">
            <div className="mb-1 flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
              <span className="text-xs text-slate-500">{t('aiPlan.profitImpact')}</span>
            </div>
            <p className="text-lg font-black text-violet-400">
              +₹{plan.profitImpact.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended actions */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t('aiPlan.recommendedActions')}
        </p>
        <div className="space-y-2">
          {plan.recommendedActions.map((action) => {
            const ucfg = urgencyConfig[action.urgency];

            return (
              <div
                key={action.id}
                className={`rounded-xl border ${ucfg.border} bg-slate-900/60 p-3`}
                role="article"
                aria-label={action.action}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${ucfg.dot}`} />
                    <p className="text-xs font-semibold text-white">{action.action}</p>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs capitalize ${ucfg.bg} ${ucfg.color}`}>
                    {action.urgency}
                  </span>
                </div>
                <p className="mb-1.5 ml-4 text-xs text-slate-500">{action.rationale}</p>
                <div className="ml-4 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    {action.expectedBenefit}
                  </span>
                  {action.deadline && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      By {new Date(action.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated timestamp */}
      <p className="mt-4 text-right text-xs text-slate-700">
        Generated: {new Date(plan.generatedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
