'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Crop Recommendation Hero ─────────────────────────────────────────────────

interface CropRecommendationHeroProps {
  accuracy?: number;
  lastUpdated?: string;
}

export function CropRecommendationHero({
  accuracy = 94,
  lastUpdated,
}: CropRecommendationHeroProps) {
  const t = useTranslations('cropRecommendation.hero');

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 px-6 py-10 md:px-10 md:py-14">
      {/* Decorative grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-1/3 h-48 w-48 rounded-full bg-teal-400/10 blur-2xl"
      />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          {/* AI Badge */}
          <Badge
            variant="outline"
            className="w-fit border-emerald-400/40 bg-emerald-400/10 text-emerald-300 backdrop-blur-sm"
            aria-label={t('aiBadgeLabel')}
          >
            <Sparkles className="mr-1.5 h-3 w-3" aria-hidden />
            {t('aiBadge')}
          </Badge>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
            {t('title')}
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-emerald-200/80 md:text-base">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Right stats */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap gap-4 md:flex-col md:items-end"
        >
          {/* Last Updated */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
            <Clock className="h-4 w-4 text-emerald-400" aria-hidden />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400/70">
                {t('lastUpdated')}
              </p>
              <p className="text-sm font-medium text-white">{formattedDate}</p>
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400/70">
                {t('accuracy')}
              </p>
              <p className="text-sm font-medium text-white">{accuracy}%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
