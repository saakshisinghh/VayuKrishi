"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, TrendingDown, BarChart3, MapPin, Activity } from "lucide-react";
import { useMarketSummary } from "../queries/market.queries";
import { MarketSummarySkeleton } from "./market-skeleton";
import { MarketError } from "./market-error";
import { cn } from "@/lib/utils/helpers";

export function MarketHero() {
  const t = useTranslations("market.hero");
  const { data: summary, isLoading, isError, refetch } = useMarketSummary();

  if (isLoading) return <MarketSummarySkeleton />;
  if (isError) return <MarketError onRetry={refetch} />;

  const statCards = [
    {
      label: t("topGainer"),
      value: summary?.topGainer.crop ?? "—",
      sub: `+${summary?.topGainer.changePercent.toFixed(1)}%`,
      price: `₹${summary?.topGainer.price}`,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: t("topLoser"),
      value: summary?.topLoser.crop ?? "—",
      sub: `${summary?.topLoser.changePercent.toFixed(1)}%`,
      price: `₹${summary?.topLoser.price}`,
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
    },
    {
      label: t("highestDemand"),
      value: summary?.highestDemandCrop.crop ?? "—",
      sub: `${t("demandScore")}: ${summary?.highestDemandCrop.demandScore}/100`,
      price: null,
      icon: BarChart3,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      label: t("bestRegion"),
      value: summary?.bestSellingRegion.region ?? "—",
      sub: `${t("volume")}: ${(summary?.bestSellingRegion.volume ?? 0).toLocaleString("en-IN")} MT`,
      price: null,
      icon: MapPin,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
      border: "border-violet-200 dark:border-violet-800",
    },
  ];

  return (
    <section aria-label={t("title")} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              summary?.marketStatus === "open"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            )}
          >
            <Activity className="h-3 w-3" />
            {t(`status.${summary?.marketStatus ?? "closed"}`)}
          </span>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("gainers")}</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {summary?.priceChangeSummary.gainers ?? 0}
          </span>
        </div>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("losers")}</span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            {summary?.priceChangeSummary.losers ?? 0}
          </span>
        </div>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("demandIndex")}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {summary?.demandIndex ?? 0}/100
          </span>
        </div>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("markets")}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {summary?.totalMarkets ?? 0}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={cn(
                "rounded-xl border p-4 transition-shadow hover:shadow-md",
                card.bg,
                card.border
              )}
              role="region"
              aria-label={card.label}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {card.label}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{card.value}</p>
                  <p className={cn("text-sm font-semibold", card.color)}>{card.sub}</p>
                  {card.price && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{card.price}/kg</p>
                  )}
                </div>
                <div className={cn("rounded-lg p-2", card.bg)}>
                  <Icon className={cn("h-5 w-5", card.color)} aria-hidden />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
