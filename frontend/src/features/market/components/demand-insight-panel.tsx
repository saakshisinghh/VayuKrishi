"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, TrendingDown, Minus, BarChart2 } from "lucide-react";
import { useDemandSummary } from "../queries/market.queries";
import { DemandTrendChart } from "./price-trend-chart";
import { MarketSummarySkeleton } from "./market-skeleton";
import { MarketError } from "./market-error";
import { cn } from "@/lib/utils/helpers";
import type { DemandInsight } from "../types/demand.types";

function DemandBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : score >= 40
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", color)}>
      {score}/100
    </span>
  );
}

function DemandCropRow({ insight }: { insight: DemandInsight }) {
  const trendIcon =
    insight.demandTrend === "rising" ? (
      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
    ) : insight.demandTrend === "falling" ? (
      <TrendingDown className="h-3.5 w-3.5 text-red-500" />
    ) : (
      <Minus className="h-3.5 w-3.5 text-gray-400" />
    );

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 min-w-0">
        {trendIcon}
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{insight.crop}</span>
        {insight.demandChangePercent !== 0 && (
          <span
            className={cn(
              "text-xs font-semibold",
              insight.demandChangePercent > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {insight.demandChangePercent > 0 ? "+" : ""}{insight.demandChangePercent.toFixed(1)}%
          </span>
        )}
      </div>
      <DemandBadge score={insight.demandScore} />
    </div>
  );
}

export function DemandInsightPanel() {
  const t = useTranslations("market.demand");
  const { data: summary, isLoading, isError, refetch } = useDemandSummary();

  if (isLoading) return <MarketSummarySkeleton />;
  if (isError) return <MarketError onRetry={refetch} />;
  if (!summary) return null;

  const sections = [
    {
      title: t("highDemand"),
      crops: summary.highDemandCrops,
      badge: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800",
    },
    {
      title: t("emerging"),
      crops: summary.emergingCrops,
      badge: "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800",
    },
    {
      title: t("declining"),
      crops: summary.decliningCrops,
      badge: "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800",
    },
  ];

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.title}
            className={cn("rounded-xl border p-4", section.badge)}
            role="region"
            aria-label={section.title}
          >
            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {section.title}
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {section.crops.slice(0, 5).map((insight) => (
                <DemandCropRow key={insight.cropId} insight={insight} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Regional Hotspots */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("regionalDemand")}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {summary.regionalHotspots.slice(0, 5).map((region) => (
            <div key={region.region} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{region.region}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{region.state}</p>
              <DemandBadge score={region.demandScore} />
            </div>
          ))}
        </div>
      </div>

      {/* Demand chart for top crop */}
      {summary.highDemandCrops.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <DemandTrendChart insights={summary.highDemandCrops.slice(0, 1)} />
        </div>
      )}
    </section>
  );
}
