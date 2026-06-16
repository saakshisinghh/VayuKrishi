'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface QuickAction {
  id: string;
  labelKey: string;
  icon: string;
  color: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'plant',
    labelKey: 'quickActions.whatToPlant',
    icon: '🌱',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400',
    prompt: 'What should I plant this season based on my farm and soil?',
  },
  {
    id: 'disease',
    labelKey: 'quickActions.diseaseRisk',
    icon: '🔬',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50 text-amber-400',
    prompt: 'Analyze the disease risk for my current crops.',
  },
  {
    id: 'market',
    labelKey: 'quickActions.marketForecast',
    icon: '📊',
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/50 text-blue-400',
    prompt: 'Give me a market price forecast for my crops.',
  },
  {
    id: 'farmplan',
    labelKey: 'quickActions.farmPlan',
    icon: '📋',
    color: 'from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50 text-violet-400',
    prompt: 'Generate a complete farm plan for the next 3 months.',
  },
  {
    id: 'water',
    labelKey: 'quickActions.waterRecommendation',
    icon: '💧',
    color: 'from-cyan-500/10 to-sky-500/10 border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400',
    prompt: 'What is the optimal irrigation schedule for my farm?',
  },
  {
    id: 'schemes',
    labelKey: 'quickActions.govtSchemes',
    icon: '🏛️',
    color: 'from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/50 text-rose-400',
    prompt: 'What government schemes am I eligible for?',
  },
];

interface QuickActionPanelProps {
  onAction: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickActionPanel: React.FC<QuickActionPanelProps> = ({
  onAction,
  disabled = false,
}) => {
  const t = useTranslations('assistant');

  return (
    <div className="px-4 pb-4">
      <p className="text-xs font-medium text-zinc-500 mb-3">{t('quickActions.title')}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.prompt)}
            disabled={disabled}
            className={`group flex items-center gap-2 rounded-xl bg-gradient-to-br border px-3 py-2.5 text-left transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${action.color}`}
            aria-label={t(action.labelKey as any)}
          >
            <span className="text-lg leading-none flex-shrink-0 group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <span className="text-xs font-medium leading-snug line-clamp-2">
              {t(action.labelKey as any)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionPanel;
