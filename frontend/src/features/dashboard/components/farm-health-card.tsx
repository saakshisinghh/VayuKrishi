"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Heart, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import type { FarmHealthData, HealthCategory } from "../types/health.types";

// ─── Grade color map ──────────────────────────────────────────────────────────
const gradeColors: Record<string, string> = {
  A: "#34D399",
  B: "#60A5FA",
  C: "#FBBF24",
  D: "#F97316",
  F: "#F87171",
};

const statusColors = {
  excellent: { bar: "bg-emerald-400", text: "text-emerald-400" },
  good: { bar: "bg-blue-400", text: "text-blue-400" },
  fair: { bar: "bg-amber-400", text: "text-amber-400" },
  poor: { bar: "bg-red-400", text: "text-red-400" },
};

// ─── Circular gauge ───────────────────────────────────────────────────────────
function HealthGauge({ score, grade }: { score: number; grade: string }) {
  const color = gradeColors[grade] ?? "#94A3B8";
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* Progress */}
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        {/* Glow effect */}
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          opacity={0.3}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="text-center">
        <motion.span
          className="text-2xl font-black"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}
        </motion.span>
        <div className="text-xs text-white/40 -mt-1">/ 100</div>
      </div>
    </div>
  );
}

// ─── Single health category bar ───────────────────────────────────────────────
function HealthBar({ category, index }: { category: HealthCategory; index: number }) {
  const t = useTranslations("dashboard.health");
  const colors = statusColors[category.status];
  const trendIcon =
    category.trend === "improving" ? (
      <TrendingUp className="w-3 h-3 text-emerald-400" />
    ) : category.trend === "declining" ? (
      <TrendingDown className="w-3 h-3 text-red-400" />
    ) : (
      <Minus className="w-3 h-3 text-slate-400" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-white/70">{t(category.id as any)}</span>
          {trendIcon}
        </div>
        <span className={`text-xs font-bold ${colors.text}`}>{category.score}</span>
      </div>

      {/* Track */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${category.score}%` }}
          transition={{ duration: 0.9, delay: 0.5 + index * 0.08, ease: "easeOut" }}
        />
      </div>
      <p className="text-[10px] text-white/30 leading-tight">{category.detail}</p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface FarmHealthCardProps {
  data: FarmHealthData;
}

export function FarmHealthCard({ data }: FarmHealthCardProps) {
  const t = useTranslations("dashboard.health");
  const gradeColor = gradeColors[data.grade] ?? "#94A3B8";

  return (
    <div className="rounded-2xl border bg-slate-900/60 backdrop-blur-sm overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-rose-500/15 flex items-center justify-center">
          <Heart className="w-4 h-4 text-rose-400" />
        </div>
        <h2 className="font-semibold text-white">{t("title")}</h2>
        {data.trend !== 0 && (
          <div
            className={`ml-auto flex items-center gap-1 text-xs font-semibold ${
              data.trend > 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {data.trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {data.trend > 0 ? "+" : ""}{data.trend}%
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Score + Grade row */}
        <div className="flex items-center gap-5 mb-5">
          <HealthGauge score={data.overallScore} grade={data.grade} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-3xl font-black"
                style={{ color: gradeColor }}
              >
                {data.grade}
              </span>
              <span className="text-sm text-white/40">{t("grade")}</span>
            </div>
            <p className="text-xs text-white/40 max-w-[160px] leading-relaxed">
              {t("lastAssessed")}{" "}
              {new Date(data.lastAssessed).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
            <p className="text-xs text-white/30 mt-0.5">
              {t("nextDue")}{" "}
              {new Date(data.nextAssessmentDue).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-3">
          {data.breakdown.map((cat, i) => (
            <HealthBar key={cat.id} category={cat} index={i} />
          ))}
        </div>

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">
              {t("recommendations")}
            </p>
            <div className="space-y-1.5">
              {data.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                  <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                    {rec}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function HealthSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-800/50 animate-pulse p-5 space-y-4">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-full bg-slate-700" />
        <div className="flex-1 space-y-2 pt-2">
          <div className="h-8 w-12 bg-slate-700 rounded" />
          <div className="h-3 w-24 bg-slate-700 rounded-full" />
          <div className="h-3 w-20 bg-slate-700 rounded-full" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between">
            <div className="h-3 w-24 bg-slate-700 rounded-full" />
            <div className="h-3 w-6 bg-slate-700 rounded-full" />
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full" />
        </div>
      ))}
    </div>
  );
}
