'use client';

import { useTranslations } from 'next-intl';
import { Layers, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { SoilHealth } from '../types/farm-health.types';

interface SoilHealthCardProps {
  soilHealth: SoilHealth;
}

function NutrientBar({
  label,
  value,
  unit = '%',
  max = 100,
  color,
}: {
  label: string;
  value: number;
  unit?: string;
  max?: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-white">
          {value}
          {unit}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const conditionConfig = {
  excellent: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  good: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  fair: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  poor: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
};

export function SoilHealthCard({ soilHealth }: SoilHealthCardProps) {
  const t = useTranslations('farmHealth');
  const condition = conditionConfig[soilHealth.soilCondition];

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('soil.title')}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
            <Layers className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{t('soil.title')}</h2>
            <p className="text-xs text-slate-500">{t('soil.subtitle')}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${condition.color} ${condition.bg}`}>
          {condition.icon}
          <span className="capitalize">{soilHealth.soilCondition}</span>
        </div>
      </div>

      {/* pH display */}
      <div className="mb-5 flex items-center gap-4 rounded-xl bg-slate-800/40 p-4">
        <div className="text-center">
          <span className="block text-3xl font-black text-white">{soilHealth.ph}</span>
          <span className="text-xs text-slate-500">{t('soil.ph')}</span>
        </div>
        <div className="flex-1">
          {/* pH scale */}
          <div className="relative h-3 overflow-hidden rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500">
            <div
              className="absolute top-0 h-3 w-1 rounded-full bg-white shadow-lg shadow-white/50"
              style={{ left: `${((soilHealth.ph - 4) / 10) * 100}%` }}
              aria-label={`pH ${soilHealth.ph}`}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-600">
            <span>4 Acidic</span>
            <span>7 Neutral</span>
            <span>14 Alkaline</span>
          </div>
          <p className={`mt-1 text-xs font-medium ${soilHealth.phStatus === 'optimal' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {soilHealth.phStatus === 'optimal' ? '✓ Optimal range (6.5–7.5)' : `⚠ ${soilHealth.phStatus === 'low' ? 'Too acidic' : 'Too alkaline'}`}
          </p>
        </div>
      </div>

      {/* Nutrients */}
      <div className="mb-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('soil.nutrients')}</p>
        <NutrientBar label={t('soil.organicMatter')} value={soilHealth.organicMatter} unit="%" max={8} color="#10b981" />
        <NutrientBar label={t('soil.nitrogen')} value={soilHealth.nitrogen} unit="%" max={100} color="#3b82f6" />
        <NutrientBar label={t('soil.phosphorus')} value={soilHealth.phosphorus} unit="%" max={100} color="#f59e0b" />
        <NutrientBar label={t('soil.potassium')} value={soilHealth.potassium} unit="%" max={100} color="#8b5cf6" />
      </div>

      {/* Recommendations */}
      {soilHealth.recommendations.length > 0 && (
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
          <p className="mb-2 text-xs font-semibold text-amber-400">{t('soil.recommendations')}</p>
          <ul className="space-y-1.5">
            {soilHealth.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                <span className="mt-0.5 text-amber-500">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
