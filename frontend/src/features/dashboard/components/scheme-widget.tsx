"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Landmark, CheckCircle2, Clock, ArrowRight, BadgeIndianRupee, Shield, CreditCard } from "lucide-react";
import type { GovernmentScheme } from "../types/dashboard.types";

const benefitIcons = {
  cash: BadgeIndianRupee,
  subsidy: Shield,
  loan: CreditCard,
  insurance: Shield,
};

const benefitColors = {
  cash: "text-emerald-400 bg-emerald-500/15",
  subsidy: "text-blue-400 bg-blue-500/15",
  loan: "text-violet-400 bg-violet-500/15",
  insurance: "text-amber-400 bg-amber-500/15",
};

function MatchBar({ score }: { score: number }) {
  const color = score >= 90 ? "#34D399" : score >= 75 ? "#60A5FA" : "#FBBF24";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

function SchemeCard({ scheme, index }: { scheme: GovernmentScheme; index: number }) {
  const t = useTranslations("dashboard.schemes");
  const BenefitIcon = benefitIcons[scheme.benefitType];
  const benefitColor = benefitColors[scheme.benefitType];

  const daysLeft = scheme.deadline
    ? Math.ceil((new Date(scheme.deadline).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-4 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Scheme name + eligibility */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-sm text-white">{scheme.name}</h3>
            {scheme.isEligible && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-300">{t("eligible")}</span>
              </div>
            )}
          </div>

          {/* Match bar */}
          <div className="mb-2">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">{t("matchScore")}</span>
            <MatchBar score={scheme.matchScore} />
          </div>

          {/* Benefit type + value */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${benefitColor}`}>
              <BenefitIcon className="w-3 h-3" />
              <span className="capitalize">{scheme.benefitType}</span>
            </div>
            <span className="text-sm font-bold text-white">
              ₹{scheme.potentialBenefit.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          {daysLeft !== null && (
            <div className={`flex items-center gap-1 text-[10px] font-semibold ${
              daysLeft <= 7 ? "text-red-400" : daysLeft <= 15 ? "text-amber-400" : "text-white/40"
            }`}>
              <Clock className="w-3 h-3" />
              {daysLeft}d
            </div>
          )}
          <button
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/12 flex items-center justify-center transition-colors"
            aria-label={t("viewScheme")}
          >
            <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
interface SchemeWidgetProps {
  schemes: GovernmentScheme[];
}

export function SchemeWidget({ schemes }: SchemeWidgetProps) {
  const t = useTranslations("dashboard.schemes");
  const eligibleCount = schemes.filter((s) => s.isEligible).length;

  return (
    <div className="rounded-2xl border bg-slate-900/60 backdrop-blur-sm overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Landmark className="w-4 h-4 text-amber-400" />
        </div>
        <h2 className="font-semibold text-white">{t("title")}</h2>
        <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-300">
            {eligibleCount} {t("eligible")}
          </span>
        </div>
      </div>

      {/* Schemes list */}
      <div className="p-3 space-y-2">
        {schemes.length === 0 ? (
          <div className="py-6 text-center">
            <Landmark className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">{t("noSchemes")}</p>
          </div>
        ) : (
          schemes.map((scheme, i) => (
            <SchemeCard key={scheme.id} scheme={scheme} index={i} />
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5">
        <button className="w-full py-2.5 rounded-xl border border-white/8 hover:bg-white/5 text-sm text-white/60 hover:text-white/80 transition-colors flex items-center justify-center gap-2">
          {t("viewAll")}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
