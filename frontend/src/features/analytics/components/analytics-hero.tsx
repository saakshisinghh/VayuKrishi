"use client";

import { useTranslations } from "next-intl";
import { useAnalyticsSummary } from "@/features/analytics/hooks/use-analytics-summary";
import { TrendingUp, Activity, DollarSign, Calendar } from "lucide-react";

export function AnalyticsHero() {
  const t = useTranslations("analytics.hero");
  const { data } = useAnalyticsSummary();

  const stats = [
    {
      label: t("farmPerformance"),
      value: data?.farmPerformance ?? "--",
      unit: "%",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: t("productivityIndex"),
      value: data?.productivityIndex ?? "--",
      unit: "/100",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: t("profitabilityScore"),
      value: data?.profitabilityScore ?? "--",
      unit: "/10",
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: t("seasonOverview"),
      value: data?.currentSeason ?? "--",
      unit: "",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <section aria-labelledby="analytics-hero-heading">
      <div className="mb-4">
        <h1
          id="analytics-hero-heading"
          className="text-2xl md:text-3xl font-bold text-foreground"
        >
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-xl p-4 ${stat.bg} border border-border/40 flex flex-col gap-3`}
              role="status"
              aria-label={`${stat.label}: ${stat.value}${stat.unit}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {stat.unit}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
