"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TrendingUp, TrendingDown, Minus, Sprout, IndianRupee, Heart, ShieldAlert } from "lucide-react";
import type { FarmSnapshot } from "../types/dashboard.types";

const riskColors = {
  low: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  moderate: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400" },
  high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/20", dot: "bg-orange-400" },
  critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-400" },
};

function TrendBadge({ value, unit = "%" }: { value: number; unit?: string }) {
  const isUp = value > 0;
  const isFlat = value === 0;
  return (
    <div
      className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        isFlat
          ? "bg-slate-500/20 text-slate-400"
          : isUp
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      {isFlat ? (
        <Minus className="w-3 h-3" />
      ) : isUp ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {isFlat ? "Stable" : `${isUp ? "+" : ""}${value}${unit}`}
    </div>
  );
}

interface CardConfig {
  id: keyof FarmSnapshot;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: React.ReactNode;
  trend?: React.ReactNode;
  sub?: string;
}

interface FarmSnapshotCardProps {
  data: FarmSnapshot;
  index: number;
}

export function FarmSnapshotCard({ data, index }: FarmSnapshotCardProps) {
  const t = useTranslations("dashboard.snapshot");
  const risk = riskColors[data.diseaseRisk];

  const cards: CardConfig[] = [
    {
      id: "activeCrop",
      icon: Sprout,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      label: t("activeCrop"),
      value: <span className="font-bold text-2xl text-white">{data.activeCrop}</span>,
      sub: data.activeCropStage,
    },
    {
      id: "projectedProfit",
      icon: IndianRupee,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      label: t("projectedProfit"),
      value: (
        <span className="font-bold text-2xl text-white">
          ₹{(data.projectedProfit / 1000).toFixed(0)}K
        </span>
      ),
      trend: <TrendBadge value={data.projectedProfitTrend} />,
      sub: t("thisSeasonEstimate"),
    },
    {
      id: "farmHealthScore",
      icon: Heart,
      iconBg: "bg-rose-500/15",
      iconColor: "text-rose-400",
      label: t("farmHealth"),
      value: (
        <div className="flex items-end gap-1">
          <span className="font-bold text-2xl text-white">{data.farmHealthScore}</span>
          <span className="text-white/40 text-base mb-0.5">/100</span>
        </div>
      ),
      trend: <TrendBadge value={data.farmHealthTrend} />,
      sub: t("overallScore"),
    },
    {
      id: "diseaseRisk",
      icon: ShieldAlert,
      iconBg: risk.bg,
      iconColor: risk.text,
      label: t("diseaseRisk"),
      value: (
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${risk.dot}`}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className={`font-bold text-2xl capitalize ${risk.text}`}>{data.diseaseRisk}</span>
        </div>
      ),
      sub: `${data.diseaseRiskScore}/100`,
    },
  ];

  const card = cards[index];
  if (!card) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border bg-slate-900/60 backdrop-blur-sm p-5 flex flex-col gap-4 hover:border-white/15 transition-colors group"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04), transparent 70%)" }}
      />

      {/* Icon + label */}
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
          <card.icon className={`w-5 h-5 ${card.iconColor}`} />
        </div>
        {card.trend}
      </div>

      {/* Value */}
      <div className="space-y-0.5">
        {card.value}
        <p className="text-xs text-white/40 font-medium">{card.label}</p>
        {card.sub && <p className="text-xs text-white/30">{card.sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function FarmSnapshotSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-800/50 animate-pulse p-5 flex flex-col gap-4" style={{ minHeight: 140 }}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-700 rounded-xl" />
        <div className="h-5 w-14 bg-slate-700 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-7 w-24 bg-slate-700 rounded-lg" />
        <div className="h-3 w-16 bg-slate-700 rounded-full" />
      </div>
    </div>
  );
}
