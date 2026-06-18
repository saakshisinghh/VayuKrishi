"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, ChevronDown, TrendingUp, Shield, BarChart3, CheckCircle2 } from "lucide-react";
import type { AIRecommendation } from "../types/dashboard.types";
import { useDashboardUIStore } from "../store/dashboard-ui-store";

const demandColors = {
  low: "text-slate-400 bg-slate-500/15",
  medium: "text-amber-400 bg-amber-500/15",
  high: "text-emerald-400 bg-emerald-500/15",
};

function ConfidenceRing({ score }: { score: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke={score >= 80 ? "#34D399" : score >= 60 ? "#FBBF24" : "#F87171"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        />
      </svg>
      <span className="text-xs font-bold text-white">{score}%</span>
    </div>
  );
}

interface AIRecommendationCardProps {
  data: AIRecommendation;
  index: number;
}

export function AIRecommendationCard({ data, index }: AIRecommendationCardProps) {
  const t = useTranslations("dashboard.ai");
  const { expandedRecommendation, setExpandedRecommendation } = useDashboardUIStore();
  const isExpanded = expandedRecommendation === data.id;

  const toggle = () => setExpandedRecommendation(isExpanded ? null : data.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-2xl border bg-slate-900/60 backdrop-blur-sm overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <button
        onClick={toggle}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
        aria-expanded={isExpanded}
        aria-label={`${t("recommendationFor")} ${data.recommendedCrop}`}
      >
        {/* AI badge + confidence */}
        <div className="flex-shrink-0">
          <ConfidenceRing score={data.confidenceScore} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300">{t("aiPick")}</span>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${demandColors[data.marketDemand]}`}
            >
              {data.marketDemand} {t("demand")}
            </span>
          </div>
          <h3 className="font-bold text-lg text-white leading-tight">{data.recommendedCrop}</h3>
          <p className="text-xs text-white/40 mt-0.5">{data.season}</p>
        </div>

        {/* Right stats */}
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-bold text-emerald-400">
            ₹{(data.expectedProfit / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-white/40">{t("expectedProfit")}</div>
          <div className="flex items-center gap-1 justify-end mt-1">
            <Shield className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/40">
              {t("risk")} {data.riskScore}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-white/30 flex-shrink-0 mt-1 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              {/* Reasoning */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  {t("reasoning")}
                </p>
                <p className="text-sm text-white/70 leading-relaxed">{data.reasoning}</p>
              </div>

              {/* Key factors */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  {t("keyFactors")}
                </p>
                <div className="space-y-1.5">
                  {data.keyFactors.map((factor, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-white/70">{factor}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mini stats bar */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: BarChart3,
                    label: t("soilFit"),
                    value: `${data.soilCompatibility}%`,
                    color: "text-blue-400",
                  },
                  {
                    icon: TrendingUp,
                    label: t("confidence"),
                    value: `${data.confidenceScore}%`,
                    color: "text-violet-400",
                  },
                  {
                    icon: Shield,
                    label: t("riskScore"),
                    value: data.riskScore,
                    color: "text-amber-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/5 p-3 flex flex-col gap-1 items-center text-center"
                  >
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className={`text-base font-bold ${stat.color}`}>{stat.value}</span>
                    <span className="text-[10px] text-white/40">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Container with header ────────────────────────────────────────────────────
interface AIRecommendationPanelProps {
  recommendations: AIRecommendation[];
}

export function AIRecommendationPanel({ recommendations }: AIRecommendationPanelProps) {
  const t = useTranslations("dashboard.ai");

  if (!recommendations.length) {
    return (
      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-8 text-center">
        <Sparkles className="w-8 h-8 text-violet-400/50 mx-auto mb-3" />
        <p className="text-white/50 text-sm">{t("noRecommendations")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-violet-400" />
        </div>
        <h2 className="font-semibold text-white">{t("title")}</h2>
        <span className="ml-auto text-xs text-white/30">{t("tapToExpand")}</span>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec, i) => (
          <AIRecommendationCard key={rec.id} data={rec} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function AISkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-2xl bg-slate-800/50 animate-pulse p-5 flex gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 bg-slate-700 rounded-full" />
            <div className="h-6 w-32 bg-slate-700 rounded-lg" />
            <div className="h-3 w-24 bg-slate-700 rounded-full" />
          </div>
          <div className="w-16 space-y-2">
            <div className="h-6 w-16 bg-slate-700 rounded-lg" />
            <div className="h-3 w-12 bg-slate-700 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
