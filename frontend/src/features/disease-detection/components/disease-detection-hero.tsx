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
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-1/3 h-48 w-48 rounded-full bg-teal-400/10 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-3"
        >
          <Badge
            variant="outline"
            className="w-fit border-emerald-400/40 bg-emerald-400/10 text-emerald-300 backdrop-blur-sm"
          >
            <Sparkles className="mr-1.5 h-3 w-3" aria-hidden />
            {t("hero.badge")}
          </Badge>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
            {t("hero.title")}
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-emerald-200/80 md:text-base">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="flex flex-wrap gap-4 md:flex-col md:items-end"
        >
          {stats.map(({ icon: Icon, value, labelKey, subKey }) => (
            <div
              key={labelKey}
              className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-white/5 px-4 py-2.5 backdrop-blur-sm"
            >
              <Icon className="h-4 w-4 text-emerald-400" aria-hidden />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-400/70">
                  {t(subKey)}
                </p>
                <p className="text-sm font-medium text-white">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
