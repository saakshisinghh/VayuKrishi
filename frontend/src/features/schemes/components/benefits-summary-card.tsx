'use client';

import { useTranslations } from 'next-intl';
import { IndianRupee, PieChart } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { EligibilityScore } from '../types/scheme.types';

interface BenefitsSummaryCardProps {
  eligibilityScores: EligibilityScore[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4'];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
      <p className="text-xs font-semibold text-white">{payload[0].name}</p>
      <p className="text-xs text-emerald-400">₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  );
}

export function BenefitsSummaryCard({ eligibilityScores }: BenefitsSummaryCardProps) {
  const t = useTranslations('schemes');

  const chartData = eligibilityScores.map((s) => ({
    name: s.schemeName,
    value: s.potentialBenefit,
  }));

  const total = eligibilityScores.reduce((sum, s) => sum + s.potentialBenefit, 0);

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('benefits.title')}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
          <IndianRupee className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{t('benefits.title')}</h2>
          <p className="text-xs text-slate-500">{t('benefits.subtitle')}</p>
        </div>
      </div>

      {/* Total */}
      <div className="mb-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 px-4 py-3 text-center">
        <p className="text-xs text-slate-500">{t('benefits.totalPotential')}</p>
        <p className="text-2xl font-black text-emerald-400">₹{total.toLocaleString('en-IN')}</p>
      </div>

      {/* Pie chart */}
      <div aria-label="Benefits breakdown chart">
        <ResponsiveContainer width="100%" height={180}>
          <RechartsPie>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
            />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
