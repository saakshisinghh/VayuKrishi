'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CropRecommendation } from '../types/crop-recommendation.types';

// ─── Generate mock market forecast data ───────────────────────────────────────
function generateForecast(basePrice: number, days: 30 | 7) {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < days; i++) {
    price = price + (Math.random() - 0.48) * basePrice * 0.015;
    data.push({
      day: days === 7 ? `Day ${i + 1}` : `${i + 1}`,
      price: Math.round(price),
    });
  }
  return data;
}

// ─── Market Card ──────────────────────────────────────────────────────────────
function MarketCard({ crop }: { crop: CropRecommendation }) {
  const t = useTranslations('cropRecommendation.marketInsight');

  const basePrice =
    crop.id === 'soybean' ? 4800 : crop.id === 'cotton' ? 6200 : 7100;

  const weeklyForecast = generateForecast(basePrice, 7);
  const monthlyForecast = generateForecast(basePrice, 30);

  const currentPrice = weeklyForecast[0].price;
  const weekEndPrice = weeklyForecast[weeklyForecast.length - 1].price;
  const priceChange = weekEndPrice - currentPrice;
  const changePercent = ((priceChange / currentPrice) * 100).toFixed(1);
  const isUp = priceChange > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
    >
      {/* Crop header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{crop.cropName}</h4>
          <p className="text-xs text-gray-500">{t('perQuintal')}</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{currentPrice.toLocaleString('en-IN')}
          </p>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {isUp ? (
              <TrendingUp className="h-3 w-3" aria-hidden />
            ) : (
              <TrendingDown className="h-3 w-3" aria-hidden />
            )}
            {isUp ? '+' : ''}{changePercent}% {t('weekLabel')}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { label: t('currentPrice'), value: `₹${currentPrice.toLocaleString('en-IN')}` },
          {
            label: t('weekForecast'),
            value: `₹${weekEndPrice.toLocaleString('en-IN')}`,
          },
          {
            label: t('demandScore'),
            value: `${crop.demandScore}/100`,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg bg-gray-50 p-2.5 text-center dark:bg-gray-900">
            <p className="text-[10px] text-gray-400">{stat.label}</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 7-day chart */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {t('sevenDayChart')}
        </p>
        <div style={{ height: 100 }} aria-label={`${crop.cropName} 7-day price forecast`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyForecast} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(val): [string, string] => {
  const num = Number(val);

  return [
    Number.isFinite(num) ? `₹${num.toLocaleString("en-IN")}` : "-",
    t("price"),
  ];
}}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isUp ? '#10b981' : '#f43f5e'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand score bar */}
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[10px] text-gray-400">
          <span>{t('demandScore')}</span>
          <span className="font-semibold">{crop.demandScore}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ transformOrigin: 'left', width: `${crop.demandScore}%` }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Market Insight Widget ────────────────────────────────────────────────────
interface MarketInsightWidgetProps {
  recommendations: CropRecommendation[];
}

export function MarketInsightWidget({ recommendations }: MarketInsightWidgetProps) {
  const t = useTranslations('cropRecommendation.marketInsight');

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
      aria-label={t('ariaLabel')}
    >
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
            <BarChart3 className="h-4 w-4 text-blue-500" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
            <p className="text-xs text-gray-500">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 p-4 md:grid-cols-3">
        {recommendations.map((crop) => (
          <MarketCard key={crop.id} crop={crop} />
        ))}
      </div>
    </div>
  );
}
