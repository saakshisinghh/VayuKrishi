"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TrendingUp, TrendingDown, Minus, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { CropPrice, MarketData } from "../types/market.types";
import { useDashboardUIStore } from "../store/dashboard-ui-store";

// ─── Mini chart tooltip ───────────────────────────────────────────────────────
function MiniTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white shadow-xl">
      ₹{Math.round(payload[0].value).toLocaleString("en-IN")}
    </div>
  );
}

// ─── Mini sparkline chart ─────────────────────────────────────────────────────
function PriceTrendChart({ data, trend }: { data: Array<{ price: number }>; trend: CropPrice["trend"] }) {
  const color = trend === "up" ? "#34D399" : trend === "down" ? "#F87171" : "#94A3B8";
  const gradientId = `grad-${trend}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<MiniTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Single crop row ──────────────────────────────────────────────────────────
function CropRow({ crop, isSelected, onClick }: { crop: CropPrice; isSelected: boolean; onClick: () => void }) {
  const t = useTranslations("dashboard.market");
  const trendIcon =
    crop.trend === "up" ? (
      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
    ) : crop.trend === "down" ? (
      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
    ) : (
      <Minus className="w-3.5 h-3.5 text-slate-400" />
    );

  const changeColor =
    crop.change7dPercent > 0
      ? "text-emerald-400"
      : crop.change7dPercent < 0
      ? "text-red-400"
      : "text-slate-400";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-colors ${
        isSelected ? "bg-white/8 border border-white/12" : "hover:bg-white/4 border border-transparent"
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white">{crop.cropName}</span>
          {trendIcon}
        </div>
        <p className="text-xs text-white/40 mt-0.5">{crop.market}</p>
      </div>
      <div className="text-right">
        <div className="font-bold text-white text-sm">
          ₹{crop.currentPrice.toLocaleString("en-IN")}
        </div>
        <div className={`text-xs font-semibold ${changeColor}`}>
          {crop.change7dPercent > 0 ? "+" : ""}
          {crop.change7dPercent.toFixed(1)}% {t("week")}
        </div>
      </div>
    </button>
  );
}

// ─── Forecast chart (30d full) ────────────────────────────────────────────────
export function ForecastChart({ crop }: { crop: CropPrice }) {
  const t = useTranslations("dashboard.market");
  const currentPrice = crop.currentPrice;
  const lastHistoryPrice =
    crop.priceHistory[crop.priceHistory.length - 1]?.price ?? currentPrice;

  const historyData = crop.priceHistory.map((p) => ({ ...p, type: "history" }));
  const forecastData = crop.forecast30d.map((p) => ({ ...p, type: "forecast" }));
  const combined = [...historyData, ...forecastData];

  return (
    <div className="space-y-2 mt-3 pt-3 border-t border-white/5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          {t("forecastTitle")}
        </span>
        <span className="text-xs text-white/30">{t("thirtyDay")}</span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={combined} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <defs>
            <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ReferenceLine x={historyData.length - 1} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
          <Tooltip content={<MiniTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#60A5FA"
            strokeWidth={1.5}
            fill="url(#histGrad)"
            dot={false}
            activeDot={{ r: 3, fill: "#60A5FA", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-blue-400 rounded" />
          <span className="text-[10px] text-white/40">{t("historical")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-violet-400 rounded" style={{ borderTop: "1px dashed" }} />
          <span className="text-[10px] text-white/40">{t("forecast")}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Market Widget ───────────────────────────────────────────────────────
interface MarketWidgetProps {
  data: MarketData;
}

export function MarketWidget({ data }: MarketWidgetProps) {
  const t = useTranslations("dashboard.market");
  const { selectedMarketCrop, setSelectedMarketCrop } = useDashboardUIStore();
  const selectedCrop =
    data.topCrops.find((c) => c.cropId === selectedMarketCrop) ?? data.topCrops[0];

  const sentimentColor =
    data.marketSentiment === "bullish"
      ? "text-emerald-400"
      : data.marketSentiment === "bearish"
      ? "text-red-400"
      : "text-slate-400";

  return (
    <div className="rounded-2xl border bg-slate-900/60 backdrop-blur-sm overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
          <BarChart2 className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="font-semibold text-white">{t("title")}</h2>
        <span className={`ml-auto text-xs font-semibold capitalize ${sentimentColor}`}>
          {data.marketSentiment}
        </span>
      </div>

      {/* Crop list */}
      <div className="px-2 py-2 space-y-0.5">
        {data.topCrops.map((crop) => (
          <CropRow
            key={crop.cropId}
            crop={crop}
            isSelected={selectedCrop?.cropId === crop.cropId}
            onClick={() => setSelectedMarketCrop(crop.cropId)}
          />
        ))}
      </div>

      {/* Selected crop chart */}
      {selectedCrop && (
        <motion.div
          key={selectedCrop.cropId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-5 pb-5"
        >
          <div className="mt-2">
            <div className="text-xs text-white/40 mb-1">{t("sevenDayTrend")}</div>
            <PriceTrendChart data={selectedCrop.priceHistory.slice(-7)} trend={selectedCrop.trend} />
          </div>
          <ForecastChart crop={selectedCrop} />
        </motion.div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function MarketSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-800/50 animate-pulse overflow-hidden">
      <div className="p-5 space-y-3">
        <div className="h-5 w-32 bg-slate-700 rounded-full" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="flex-1 space-y-1">
              <div className="h-4 w-20 bg-slate-700 rounded" />
              <div className="h-3 w-16 bg-slate-700 rounded" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-4 w-16 bg-slate-700 rounded" />
              <div className="h-3 w-12 bg-slate-700 rounded" />
            </div>
          </div>
        ))}
        <div className="h-20 bg-slate-700 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
export function MarketError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("dashboard.market");
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-6 flex flex-col items-center gap-3 text-center">
      <BarChart2 className="w-8 h-8 text-white/20" />
      <p className="text-sm text-white/50">{t("error")}</p>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 text-xs text-white transition-colors"
      >
        {t("retry")}
      </button>
    </div>
  );
}
