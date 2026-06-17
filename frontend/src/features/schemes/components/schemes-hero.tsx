'use client';

import { useTranslations } from 'next-intl';
import { Landmark, IndianRupee, FileCheck2, Star } from 'lucide-react';
import type { SchemeSummary } from '../types/scheme.types';

interface SchemesHeroProps {
  summary: SchemeSummary;
}

export function SchemesHero({ summary }: SchemesHeroProps) {
  const t = useTranslations('schemes');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f0f1f] via-[#0e0e1c] to-[#0a0a18] border border-violet-900/40 p-6 md:p-8">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute -bottom-8 left-8 h-40 w-40 rounded-full bg-indigo-600/8 blur-2xl" />
      </div>

      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-violet-400" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            {t('hero.subtitle')}
          </span>
        </div>
        <h1 className="mb-1 text-2xl font-bold text-white md:text-3xl">{t('hero.title')}</h1>
        <p className="mb-6 text-sm text-slate-400">{t('hero.description')}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <HeroStat
            icon={<Star className="h-4 w-4 text-violet-400" />}
            label={t('hero.eligibleSchemes')}
            value={summary.totalEligible.toString()}
            color="violet"
          />
          <HeroStat
            icon={<IndianRupee className="h-4 w-4 text-emerald-400" />}
            label={t('hero.potentialBenefit')}
            value={`₹${(summary.totalPotentialBenefit / 1000).toFixed(0)}K`}
            color="emerald"
          />
          <HeroStat
            icon={<FileCheck2 className="h-4 w-4 text-blue-400" />}
            label={t('hero.inProgress')}
            value={summary.applicationsInProgress.toString()}
            color="blue"
          />
          <HeroStat
            icon={<FileCheck2 className="h-4 w-4 text-amber-400" />}
            label={t('hero.approved')}
            value={summary.applicationsApproved.toString()}
            color="amber"
          />
        </div>
      </div>
    </div>
  );
}

function HeroStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    violet: 'bg-violet-500/10 border-violet-500/20',
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20',
    amber: 'bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className={`rounded-xl border p-3 ${colorMap[color]}`}>
      <div className="mb-1 flex items-center gap-1.5">{icon}</div>
      <p className="text-lg font-black text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
