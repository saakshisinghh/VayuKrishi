"use client";

import { useTranslations } from "next-intl";
import { MapPin, Truck, Star, ArrowRight, Navigation } from "lucide-react";
import { useMarketStore } from "@/store/market-store";
import { useBestMarket } from "../queries/market.queries";
import { MarketSummarySkeleton } from "./market-skeleton";
import { MarketError } from "./market-error";
import { cn } from "@/lib/utils/helpers";
import type { BestMarket } from "../types/market.types";

function MarketCard({ market, rank }: { market: BestMarket; rank: number }) {
  const t = useTranslations("market.bestMarket");
  const profit = market.netProfit;
  const profitColor = profit > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-shadow hover:shadow-md",
        rank === 0
          ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/10"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      )}
      role="article"
      aria-label={`${rank + 1}. ${market.market.name}`}
    >
      {rank === 0 && (
        <span className="absolute -top-2.5 left-3 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
          {t("recommended")}
        </span>
      )}

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{market.market.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3" aria-hidden />
              {market.market.district}, {market.market.state}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {market.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Type badge */}
        <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {market.market.type}
        </span>

        {/* Price breakdown */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t("expectedPrice")}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ₹{market.expectedPrice}/kg
            </span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Truck className="h-3 w-3" aria-hidden /> {t("transport")}
            </span>
            <span className="font-semibold text-red-500 dark:text-red-400">
              –₹{market.transportCost}/kg
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-1.5 dark:border-gray-700">
            <span className="font-medium text-gray-700 dark:text-gray-300">{t("netProfit")}</span>
            <span className={cn("text-base font-bold", profitColor)}>₹{profit}/kg</span>
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Navigation className="h-3 w-3" aria-hidden />
            {market.market.distance} km {t("away")}
          </span>
          <span>{market.market.timings}</span>
        </div>

        {/* Reasons */}
        {market.reasons.length > 0 && (
          <ul className="space-y-1">
            {market.reasons.slice(0, 2).map((reason, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-green-500" aria-hidden />
                {reason}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function BestMarketCard() {
  const t = useTranslations("market.bestMarket");
  const { selectedCrop, selectedCropName, selectedRegion } = useMarketStore();
  const { data: markets, isLoading, isError, refetch } = useBestMarket(selectedCrop, selectedRegion);

  if (isLoading) return <MarketSummarySkeleton />;
  if (isError) return <MarketError onRetry={refetch} />;
  if (!markets?.length) return null;

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("forCrop")}: <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedCropName}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {markets.slice(0, 3).map((market, i) => (
          <MarketCard key={market.market.id} market={market} rank={i} />
        ))}
      </div>
    </section>
  );
}
