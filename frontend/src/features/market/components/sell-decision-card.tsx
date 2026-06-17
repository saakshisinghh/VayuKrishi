"use client";

import { useTranslations } from "next-intl";
import { Scale, TrendingUp, Clock, ShieldAlert } from "lucide-react";
import { useMarketStore } from "@/store/market-store";
import { useSellRecommendation } from "../queries/market.queries";
import { ForecastSkeleton } from "./market-skeleton";
import { ForecastError } from "./market-error";
import { cn } from "@/lib/utils/helpers";
import type { SellOption } from "../types/forecast.types";

const OPTION_CONFIG = {
  sell_now: {
    icon: Scale,
    labelKey: "sellNow",
    color: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300",
    accentColor: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  hold_7d: {
    icon: Clock,
    labelKey: "hold7d",
    color: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300",
    accentColor: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  hold_30d: {
    icon: TrendingUp,
    labelKey: "hold30d",
    color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300",
    accentColor: "text-green-600 dark:text-green-400",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
} as const;

function OptionCard({ option, isRecommended }: { option: SellOption; isRecommended: boolean }) {
  const t = useTranslations("market.sellDecision");
  const config = OPTION_CONFIG[option.type as keyof typeof OPTION_CONFIG];
  const Icon = config?.icon ?? Scale;

  const riskColor =
    option.riskScore <= 30
      ? "text-emerald-600 dark:text-emerald-400"
      : option.riskScore <= 60
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 p-4 transition-shadow hover:shadow-md",
        isRecommended ? config?.color : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      )}
      role="article"
      aria-label={`${t(config?.labelKey ?? option.type as any)}${isRecommended ? ` – ${t("recommended")}` : ""}`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-3 py-0.5 text-xs font-bold text-white whitespace-nowrap">
          ✓ {t("recommended")}
        </span>
      )}

      <div className="mt-1 space-y-3 text-center">
        <div className={cn("mx-auto flex h-10 w-10 items-center justify-center rounded-full", config?.badge)}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">{t(config?.labelKey ?? option.type as any)}</h3>

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("expectedPrice")}</span>
            <span className="font-bold text-gray-900 dark:text-white">₹{option.expectedPrice}/kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("profit")}</span>
            <span className={cn("font-semibold", option.profitDifference >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
              {option.profitDifference >= 0 ? "+" : ""}₹{option.profitDifference}/kg
            </span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <ShieldAlert className="h-3 w-3" aria-hidden /> {t("risk")}
            </span>
            <span className={cn("font-semibold", riskColor)}>{option.riskScore}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("probability")}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{option.probability}%</span>
          </div>
        </div>

        {/* Risk bar */}
        <div className="space-y-1">
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800" role="meter" aria-valuenow={option.riskScore} aria-valuemin={0} aria-valuemax={100} aria-label={t("risk")}>
            <div
              className={cn(
                "h-1.5 rounded-full transition-all",
                option.riskScore <= 30 ? "bg-emerald-500" : option.riskScore <= 60 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${option.riskScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SellDecisionCard() {
  const t = useTranslations("market.sellDecision");
  const { selectedCrop, selectedCropName } = useMarketStore();
  const { data: decision, isLoading, isError, refetch } = useSellRecommendation(selectedCrop);

  if (isLoading) return <ForecastSkeleton />;
  if (isError) return <ForecastError onRetry={refetch} />;
  if (!decision) return null;

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedCropName} — {t("currentPrice")}: <span className="font-semibold text-gray-800 dark:text-gray-200">₹{decision.currentPrice}/kg</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-3">
        {decision.options.map((option) => (
          <OptionCard
            key={option.type}
            option={option}
            isRecommended={option.type === decision.recommendation}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">{t("profitDifference")}:</span>{" "}
          {t("profitDiffNote", {
            amount: Math.abs(decision.profitDifference),
            action: decision.recommendation === "sell_now" ? t("sellNow") : decision.recommendation === "hold_7d" ? t("hold7d") : t("hold30d"),
          })}
        </p>
      </div>
    </section>
  );
}
