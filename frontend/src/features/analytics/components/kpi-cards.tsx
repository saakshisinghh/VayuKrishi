"use client";

import { useTranslations } from "next-intl";
import { useKPIMetrics } from "@/features/analytics/hooks/use-kpi-metrics";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils/helpers";

interface KPICardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  loading?: boolean;
}

function KPICard({ label, value, delta, deltaLabel, loading }: KPICardProps) {
  const isPositive = delta !== undefined && delta > 0;
  const isNegative = delta !== undefined && delta < 0;
  const DeltaIcon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus;
  const deltaColor = isPositive
    ? "text-emerald-600"
    : isNegative
    ? "text-red-500"
    : "text-muted-foreground";

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
        <div className="h-3 w-24 bg-muted rounded mb-3" />
        <div className="h-7 w-20 bg-muted rounded mb-2" />
        <div className="h-3 w-16 bg-muted rounded" />
      </div>
    );
  }

  return (
    <article
      className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
      aria-label={`${label}: ${value}`}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 mt-2 ${deltaColor}`}>
          <DeltaIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-xs font-medium">
            {Math.abs(delta)}% {deltaLabel}
          </span>
        </div>
      )}
    </article>
  );
}

export function KPICards() {
  const t = useTranslations("analytics.kpi");
  const { data, isLoading } = useKPIMetrics();

  const cards = [
    {
      label: t("revenue"),
      value: data ? formatCurrency(data.revenue.value) : "--",
      delta: data?.revenue.delta,
      deltaLabel: t("vsLastSeason"),
    },
    {
      label: t("yield"),
      value: data ? `${formatNumber(data.yield.value)} kg` : "--",
      delta: data?.yield.delta,
      deltaLabel: t("vsLastSeason"),
    },
    {
      label: t("farmHealth"),
      value: data ? `${data.farmHealth.value}/100` : "--",
      delta: data?.farmHealth.delta,
      deltaLabel: t("vsLastMonth"),
    },
    {
      label: t("diseaseIncidents"),
      value: data ? String(data.diseaseIncidents.value) : "--",
      delta: data?.diseaseIncidents.delta,
      deltaLabel: t("vsLastSeason"),
    },
    {
      label: t("waterSavings"),
      value: data ? `${data.waterSavings.value}%` : "--",
      delta: data?.waterSavings.delta,
      deltaLabel: t("vsBaseline"),
    },
    {
      label: t("marketPerformance"),
      value: data ? `${data.marketPerformance.value}/10` : "--",
      delta: data?.marketPerformance.delta,
      deltaLabel: t("vsLastSeason"),
    },
  ];

  return (
    <section aria-labelledby="kpi-heading">
      <h2 id="kpi-heading" className="sr-only">
        {t("sectionTitle")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <KPICard key={card.label} {...card} loading={isLoading} />
        ))}
      </div>
    </section>
  );
}
