'use client';

import { useTranslations } from 'next-intl';
import { Droplets, CloudRain, Gauge, TrendingDown } from 'lucide-react';
import type { WaterEfficiency } from '../types/farm-health.types';

interface WaterEfficiencyCardProps {
  waterEfficiency: WaterEfficiency;
}

const riskBadge: Record<string, string> = {
  low: 'bg-emerald-400/10 text-emerald-400',
  medium: 'bg-amber-400/10 text-amber-400',
  high: 'bg-orange-400/10 text-orange-400',
  critical: 'bg-red-400/10 text-red-400',
};

export function WaterEfficiencyCard({ waterEfficiency }: WaterEfficiencyCardProps) {
  const t = useTranslations('farmHealth');

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('water.title')}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
            <Droplets className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{t('water.title')}</h2>
            <p className="text-xs text-slate-500">{t('water.subtitle')}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${riskBadge[waterEfficiency.waterRisk]}`}>
          {waterEfficiency.waterRisk} {t('water.risk')}
        </span>
      </div>

      {/* Stats grid */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <StatBox
          icon={<Gauge className="h-4 w-4 text-blue-400" />}
          label={t('water.usagePerAcre')}
          value={`${waterEfficiency.usagePerAcre}L`}
          sub={t('water.perAcre')}
        />
        <StatBox
          icon={<TrendingDown className="h-4 w-4 text-emerald-400" />}
          label={t('water.savingPotential')}
          value={`₹${waterEfficiency.monthlySavingPotential}`}
          sub={t('water.perMonth')}
          highlight
        />
      </div>

      {/* Efficiency bars */}
      <div className="mb-4 space-y-3">
        <EfficiencyBar
          label={t('water.irrigationEfficiency')}
          value={waterEfficiency.irrigationEfficiency}
          color="#3b82f6"
        />
        <EfficiencyBar
          label={t('water.rainDependency')}
          value={waterEfficiency.rainDependency}
          color="#06b6d4"
          icon={<CloudRain className="h-3.5 w-3.5 text-cyan-400" />}
        />
      </div>

      {/* Recommendations */}
      {waterEfficiency.recommendations.length > 0 && (
        <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-3">
          <p className="mb-2 text-xs font-semibold text-blue-400">{t('water.recommendations')}</p>
          <ul className="space-y-1.5">
            {waterEfficiency.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                <span className="mt-0.5 text-blue-500">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-slate-800/40'}`}>
      <div className="mb-1 flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-slate-600">{sub}</p>
    </div>
  );
}

function EfficiencyBar({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-slate-400">{label}</span>
        </div>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
