"use client";

import { useTranslations } from "next-intl";
import { GitCompare, TrendingUp, TrendingDown, Minus, Crown } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { useMarketStore } from "@/store/market-store";
import { useCropComparison } from "../queries/market.queries";
import { MarketSummarySkeleton } from "./market-skeleton";
import { MarketError } from "./market-error";
import { cn } from "@/lib/utils/helpers";
import type { ComparisonCrop } from "../types/comparison.types";

const CROP_COLORS = ["#16a34a", "#2563eb", "#f97316", "#7c3aed"];

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" aria-hidden />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-500" aria-hidden />;
  return <Minus className="h-3.5 w-3.5 text-gray-400" aria-hidden />;
}

function CropComparisonCard({
  crop,
  color,
  isWinner,
  rank,
}: {
  crop: ComparisonCrop;
  color: string;
  isWinner: boolean;
  rank: number;
}) {
  const t = useTranslations("market.comparison");
  const recColor =
    crop.recommendation === "buy"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : crop.recommendation === "sell"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-shadow hover:shadow-md",
        isWinner
          ? "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/10"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      )}
      role="article"
      aria-label={`${crop.crop}${isWinner ? " – " + t("winner") : ""}`}
    >
      {isWinner && (
        <div className="absolute -top-3 left-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5">
          <Crown className="h-3 w-3 text-yellow-900" aria-hidden />
          <span className="text-xs font-bold text-yellow-900">{t("winner")}</span>
        </div>
      )}

      <div className="mt-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full" style={{ background: color }} />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg">{crop.emoji}</span>
              <h3 className="font-bold text-gray-900 dark:text-white">{crop.crop}</h3>
            </div>
          </div>
          <TrendIcon trend={crop.trend} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("currentPrice")}</p>
            <p className="font-bold text-gray-900 dark:text-white">₹{crop.currentPrice}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("forecast7d")}</p>
            <p className={cn("font-bold", crop.priceChange7d >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
              ₹{crop.forecastPrice7d}{" "}
              <span className="text-xs font-normal">
                ({crop.priceChange7d >= 0 ? "+" : ""}{crop.priceChange7d.toFixed(1)}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("demand")}</p>
            <p className="font-semibold text-gray-900 dark:text-white">{crop.demandScore}/100</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("risk")}</p>
            <p className={cn(
              "font-semibold",
              crop.riskScore <= 30 ? "text-emerald-600 dark:text-emerald-400" : crop.riskScore <= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
            )}>
              {crop.riskScore}/100
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("profitPotential")}</p>
            <p className="font-bold text-gray-900 dark:text-white">{crop.profitPotential}%</p>
          </div>
        </div>

        <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", recColor)}>
          {t(`rec.${crop.recommendation}`)}
        </span>
      </div>
    </div>
  );
}

export function CropComparisonPanel() {
  const t = useTranslations("market.comparison");
  const { comparisonCrops } = useMarketStore();
  const { data: comparison, isLoading, isError, refetch } = useCropComparison(comparisonCrops);

  if (isLoading) return <MarketSummarySkeleton />;
  if (isError) return <MarketError onRetry={refetch} />;
  if (!comparison) return null;

  const radarData = [
    { metric: t("currentPrice") },
    { metric: t("demand") },
    { metric: t("profitPotential") },
    { metric: t("lowRisk") },
    { metric: t("forecast7d") },
  ].map((item, i) => {
    const row: Record<string, string | number> = { metric: item.metric };
    comparison.crops.forEach((crop) => {
      const values = [
        crop.currentPrice,
        crop.demandScore,
        crop.profitPotential,
        100 - crop.riskScore,
        crop.priceChange7d + 50,
      ];
      row[crop.crop] = Math.max(0, values[i] ?? 0);
    });
    return row;
  });

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex items-center gap-2">
        <GitCompare className="h-5 w-5 text-orange-500 dark:text-orange-400" aria-hidden />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-4">
        {comparison.crops.map((crop, i) => (
          <CropComparisonCard
            key={crop.cropId}
            crop={crop}
            color={CROP_COLORS[i] ?? "#374151"}
            isWinner={crop.cropId === comparison.winner.cropId}
            rank={i}
          />
        ))}
      </div>

      {/* Radar Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t("radarTitle")}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            {comparison.crops.map((crop, i) => (
              <Radar
                key={crop.cropId}
                name={crop.crop}
                dataKey={crop.crop}
                stroke={CROP_COLORS[i] ?? "#374151"}
                fill={CROP_COLORS[i] ?? "#374151"}
                fillOpacity={0.12}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Winner callout */}
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/10">
        <div className="flex items-start gap-3">
          <Crown className="mt-0.5 h-5 w-5 text-yellow-500 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold text-yellow-900 dark:text-yellow-300">
              {t("winnerIs")}: {comparison.winner.crop}
            </p>
            <ul className="mt-1 space-y-0.5">
              {comparison.winner.reasons.map((r, i) => (
                <li key={i} className="text-sm text-yellow-800 dark:text-yellow-400">• {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
