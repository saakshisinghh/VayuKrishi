"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AlertTriangle, MapPin, Crop, ArrowRight, ShieldCheck, Bug } from "lucide-react";
import type { DiseaseAlert } from "../types/dashboard.types";

const riskConfig = {
  low: {
    bg: "bg-slate-800/60",
    border: "border-slate-600/30",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    icon: "text-slate-400",
    dot: "bg-slate-400",
    accentBar: "bg-slate-600",
  },
  moderate: {
    bg: "bg-amber-950/30",
    border: "border-amber-500/25",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: "text-amber-400",
    dot: "bg-amber-400",
    accentBar: "bg-amber-500",
  },
  high: {
    bg: "bg-orange-950/30",
    border: "border-orange-500/25",
    badge: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    icon: "text-orange-400",
    dot: "bg-orange-400",
    accentBar: "bg-orange-500",
  },
  critical: {
    bg: "bg-red-950/30",
    border: "border-red-500/30",
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
    icon: "text-red-400",
    dot: "bg-red-400",
    accentBar: "bg-red-500",
  },
};

interface DiseaseAlertCardProps {
  data: DiseaseAlert;
  index: number;
}

export function DiseaseAlertCard({ data, index }: DiseaseAlertCardProps) {
  const t = useTranslations("dashboard.disease");
  const config = riskConfig[data.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`relative rounded-2xl border ${config.bg} ${config.border} overflow-hidden group`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentBar}`} />

      <div className="pl-4 pr-5 py-4 flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <motion.div
            animate={
              data.riskLevel === "critical" || data.riskLevel === "high"
                ? { opacity: [1, 0.5, 1] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertTriangle className={`w-5 h-5 ${config.icon}`} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-white text-sm">{data.diseaseName}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${config.badge}`}
                >
                  {data.riskLevel}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <Bug className="w-3 h-3 text-white/30" />
                  <span className="text-xs text-white/50">{data.affectedCrop}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-white/30" />
                  <span className="text-xs text-white/50">
                    {data.distanceFromFarm} {t("kmAway")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  <span className="text-xs text-white/40">
                    {data.affectedAreaKm} {t("kmRadius")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended action */}
          <div className="mt-2.5 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/50 leading-relaxed">{data.recommendedAction}</p>
          </div>
        </div>

        {/* CTA arrow */}
        <button
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group-hover:bg-white/10 mt-0.5"
          aria-label={t("viewDetails")}
        >
          <ArrowRight className="w-4 h-4 text-white/40" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Disease Alert Center Container ──────────────────────────────────────────
interface DiseaseAlertCenterProps {
  alerts: DiseaseAlert[];
}

export function DiseaseAlertCenter({ alerts }: DiseaseAlertCenterProps) {
  const t = useTranslations("dashboard.disease");
  const criticalCount = alerts.filter(
    (a) => a.riskLevel === "critical" || a.riskLevel === "high"
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
        <h2 className="font-semibold text-white">{t("title")}</h2>
        {criticalCount > 0 && (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20"
          >
            {criticalCount} {t("urgent")}
          </motion.span>
        )}
      </div>

      {alerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6 flex items-center gap-3"
        >
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <p className="font-semibold text-emerald-300 text-sm">{t("allClear")}</p>
            <p className="text-xs text-emerald-400/60 mt-0.5">{t("allClearDesc")}</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <DiseaseAlertCard key={alert.id} data={alert} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
