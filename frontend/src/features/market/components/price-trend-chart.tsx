"use client";

import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import type { PriceForecast } from "../types/forecast.types";
import { format, parseISO } from "date-fns";

interface PriceForecastChartProps {
  forecast: PriceForecast;
  period: "7d" | "30d";
}

export function PriceForecastChart({ forecast, period }: PriceForecastChartProps) {
  const t = useTranslations("market.forecast");

  const historyData = forecast.priceHistory.map((h) => ({
    date: h.date,
    label: format(parseISO(h.date), "dd MMM"),
    historicalPrice: h.price,
    lowerBound: null,
    upperBound: null,
    predictedPrice: null,
  }));

  const forecastPoints = forecast.forecasts
    .slice(0, period === "7d" ? 7 : 30)
    .map((f) => ({
      date: f.date,
      label: format(parseISO(f.date), "dd MMM"),
      historicalPrice: null,
      lowerBound: f.lowerBound,
      upperBound: f.upperBound,
      predictedPrice: f.predictedPrice,
    }));

  const chartData = [...historyData, ...forecastPoints];
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-2" aria-label={t("chartAria")}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t("priceChart")} – {forecast.crop}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.05} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v}`}
            width={45}
          />
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg, #fff)",
              border: "1px solid var(--tooltip-border, #e5e7eb)",
              borderRadius: "8px",
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                historicalPrice: t("historical"),
                predictedPrice: t("predicted"),
                upperBound: t("upperBound"),
                lowerBound: t("lowerBound"),
              };
              return [`₹${value?.toFixed(2)}`, labels[name] ?? name];
            }}
          />
          <ReferenceLine x={format(parseISO(today), "dd MMM")} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: t("today"), fontSize: 10, fill: "#f59e0b" }} />
          <Area type="monotone" dataKey="historicalPrice" stroke="#16a34a" strokeWidth={2} fill="url(#historicalGrad)" dot={false} connectNulls={false} />
          <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="url(#bandGrad)" dot={false} connectNulls={false} />
          <Area type="monotone" dataKey="lowerBound" stroke="transparent" fill="transparent" dot={false} connectNulls={false} />
          <Area type="monotone" dataKey="predictedPrice" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 3" fill="url(#forecastGrad)" dot={false} connectNulls={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-green-600" /> {t("historical")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-violet-600" /> {t("predicted")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-4 rounded bg-violet-100 dark:bg-violet-900/30" /> {t("confidenceBand")}
        </span>
      </div>
    </div>
  );
}

// ---

import type { DemandInsight } from "../types/demand.types";

interface DemandTrendChartProps {
  insights: DemandInsight[];
}

export function DemandTrendChart({ insights }: DemandTrendChartProps) {
  const t = useTranslations("market.demand");
  if (!insights.length) return null;

  const crop = insights[0];
  const chartData = crop.weeklyTrend.map((d) => ({
    label: format(parseISO(d.date), "dd MMM"),
    score: d.score,
    volume: d.volume,
  }));

  return (
    <div className="space-y-2" aria-label={t("demandChartAria")}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("weeklyDemandTrend")}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.05} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}/100`, t("demandScore")]} />
          <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} fill="url(#demandGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---

import type { SeasonalTrend } from "../types/forecast.types";
import {
  BarChart,
  Bar,
} from "recharts";

interface SeasonalTrendChartProps {
  seasonal: SeasonalTrend;
}

export function SeasonalTrendChart({ seasonal }: SeasonalTrendChartProps) {
  const t = useTranslations("market.trend");
  const chartData = seasonal.monthly.map((m) => ({
    month: m.month.slice(0, 3),
    avgPrice: m.avgPrice,
    demand: m.demandIndex,
  }));

  return (
    <div className="space-y-2" aria-label={t("seasonalChartAria")}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t("seasonalTrend")} – {seasonal.crop}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.05} />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="price" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} width={40} />
          <YAxis yAxisId="demand" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} width={30} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="price" dataKey="avgPrice" fill="#16a34a" radius={[4, 4, 0, 0]} name={t("avgPrice")} />
          <Bar yAxisId="demand" dataKey="demand" fill="#7c3aed" radius={[4, 4, 0, 0]} name={t("demand")} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t("peakMonth")}: <strong>{seasonal.peakMonth}</strong> · {t("lowMonth")}: <strong>{seasonal.lowMonth}</strong>
      </p>
    </div>
  );
}
