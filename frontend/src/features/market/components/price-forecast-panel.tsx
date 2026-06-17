"use client";

import { useTranslations } from "next-intl";
import { Brain, TrendingUp, TrendingDown, AlertCircle, ChevronDown } from "lucide-react";
import { useMarketStore } from "@/store/market-store";
import { useMarketForecast } from "../queries/market.queries";
import { PriceForecastChart } from "./price-trend-chart";
import { ForecastSkeleton } from "./market-skeleton";
import { ForecastError } from "./market-error";
import { cn } from "@/lib/utils/helpers";

const RISK_CONFIG = {
  low: { label: "Low Risk", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  medium: { label: "Medium Risk", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  high: { label: "High Risk", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
};

export function PriceForecastPanel() {
  const t = useTranslations("market.forecast");
  const { selectedCrop, selectedCropName, forecastPeriod, setForecastPeriod } = useMarketStore();
  const { data: forecast, isLoading, isError, refetch } = useMarketForecast(selectedCrop);

  if (isLoading) return <ForecastSkeleton />;
  if (isError) return <ForecastError onRetry={refetch} />;
  if (!forecast) return null;

  const periodData = forecastPeriod === "7d" ? forecast.forecast7d : forecast.forecast30d;
  const priceUp = periodData.changePercent > 0;
  const risk = RISK_CONFIG[forecast.aiRecommendation.riskLevel];

  const actionLabels: Record<string, string> = {
    sell_now: t("action.sellNow"),
    hold_7d: t("action.hold7d"),
    hold_30d: t("action.hold30d"),
    sell_partial: t("action.sellPartial"),
  };

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t("selectedCrop")}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{selectedCropName}</span>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(["7d", "30d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setForecastPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  forecastPeriod === p
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300"
                )}
                aria-pressed={forecastPeriod === p}
              >
                {p === "7d" ? t("period.7d") : t("period.30d")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Forecast Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            {forecastPeriod === "7d" ? t("forecast7d") : t("forecast30d")}
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("currentPrice")}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{forecast.currentPrice}/{forecast.unit}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("expectedPrice")}</p>
              <p className={cn("text-2xl font-bold", priceUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                ₹{periodData.expectedPrice}/{forecast.unit}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {priceUp ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" aria-hidden />
              )}
              <span className={cn("text-sm font-semibold", priceUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {priceUp ? "+" : ""}{periodData.changePercent.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400">({t("range")}: ₹{periodData.minPrice}–₹{periodData.maxPrice})</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">{t("confidence")}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{forecast.confidenceScore}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800" role="meter" aria-valuenow={forecast.confidenceScore} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
                style={{ width: `${forecast.confidenceScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <PriceForecastChart forecast={forecast} period={forecastPeriod} />
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-900/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0" aria-hidden />
            <span className="text-sm font-semibold text-violet-800 dark:text-violet-300">
              {t("aiRecommendation")}
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-violet-600 px-3 py-1 text-sm font-bold text-white">
                {actionLabels[forecast.aiRecommendation.action] ?? forecast.aiRecommendation.action}
              </span>
              {forecast.aiRecommendation.holdDays && (
                <span className="text-sm text-violet-700 dark:text-violet-300">
                  {t("holdFor", { days: forecast.aiRecommendation.holdDays })}
                </span>
              )}
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", risk.bg, risk.color)}>
                {risk.label}
              </span>
              <span className="text-xs text-violet-600 dark:text-violet-400">
                {t("expectedGain")}: +{forecast.aiRecommendation.expectedGain}%
              </span>
            </div>
            <p className="text-sm text-violet-700 dark:text-violet-300">
              {forecast.aiRecommendation.reasoning}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
