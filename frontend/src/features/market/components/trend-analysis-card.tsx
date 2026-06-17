"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMarketStore } from "@/store/market-store";
import { useMarketForecast, useSeasonalTrend } from "../queries/market.queries";
import { PriceForecastChart, SeasonalTrendChart } from "./price-trend-chart";
import { ForecastSkeleton } from "./market-skeleton";
import { ForecastError } from "./market-error";
import { cn } from "@/lib/utils/helpers";

type TrendTab = "weekly" | "monthly" | "seasonal" | "yearly";

export function TrendAnalysisCard() {
  const t = useTranslations("market.trend");
  const { selectedCrop, selectedCropName } = useMarketStore();
  const [activeTab, setActiveTab] = useState<TrendTab>("weekly");

  const { data: forecast, isLoading: fLoading, isError: fError, refetch: fRefetch } = useMarketForecast(selectedCrop);
  const { data: seasonal, isLoading: sLoading, isError: sError, refetch: sRefetch } = useSeasonalTrend(selectedCrop);

  const tabs: { key: TrendTab; label: string }[] = [
    { key: "weekly", label: t("weekly") },
    { key: "monthly", label: t("monthly") },
    { key: "seasonal", label: t("seasonal") },
    { key: "yearly", label: t("yearly") },
  ];

  const isLoading = fLoading || sLoading;
  const isError = fError || sError;

  if (isLoading) return <ForecastSkeleton />;
  if (isError) return <ForecastError onRetry={() => { fRefetch(); sRefetch(); }} />;

  return (
    <section aria-label={t("title")} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {selectedCropName}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label={t("trendTabs")}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {(activeTab === "weekly" || activeTab === "monthly") && forecast && (
          <PriceForecastChart forecast={forecast} period={activeTab === "weekly" ? "7d" : "30d"} />
        )}
        {activeTab === "seasonal" && seasonal && (
          <SeasonalTrendChart seasonal={seasonal} />
        )}
        {activeTab === "yearly" && seasonal && (
          <div className="space-y-3">
            <SeasonalTrendChart seasonal={seasonal} />
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("yearlyNote")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
