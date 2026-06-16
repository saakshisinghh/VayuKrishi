"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Brain, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    icon: Brain,
    labelKey: "hero.stats.accuracy",
    value: "96.4%",
    subKey: "hero.stats.accuracyLabel",
  },
  {
    icon: Clock,
    labelKey: "hero.stats.modelUpdate",
    value: "2 days ago",
    subKey: "hero.stats.modelUpdateLabel",
  },
  {
    icon: ShieldCheck,
    labelKey: "hero.stats.diseases",
    value: "350+",
    subKey: "hero.stats.diseasesLabel",
  },
];

export function DiseaseDetectionHero() {
  const t = useTranslations("diseaseDetection");

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 px-6 py-10 md:px-10 md:py-14">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Text */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge className="mb-3 gap-1.5 border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20">
              <Sparkles className="h-3 w-3" />
              {t("hero.badge")}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white md:text-4xl"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-base leading-relaxed text-emerald-200/80"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          {stats.map(({ icon: Icon, value, labelKey, subKey }) => (
            <div
              key={labelKey}
              className="flex min-w-[120px] flex-col items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <Icon className="mb-1 h-5 w-5 text-emerald-400" />
              <span className="text-xl font-bold text-white">{value}</span>
              <span className="mt-0.5 text-center text-xs text-emerald-300/70">
                {t(subKey)}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
