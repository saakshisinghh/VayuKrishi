"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDiseaseAnalytics } from "@/features/analytics/hooks/use-disease-analytics";
import { ChartSkeleton } from "./chart-skeleton";

function DiseaseAnalyticsWidgetBase() {
  const t = useTranslations("analytics.widgets.disease");
  const { data, isLoading } = useDiseaseAnalytics();

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="rounded-xl border border-border bg-card p-5" role="img" aria-label={t("ariaLabel")}>
      <h3 className="text-sm font-semibold text-foreground mb-1">{t("title")}</h3>
      <p className="text-xs text-muted-foreground mb-4">{t("subtitle")}</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
          <Line type="monotone" dataKey="detected" name={t("detected")} stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="treated" name={t("treated")} stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export const DiseaseAnalyticsWidget = memo(DiseaseAnalyticsWidgetBase);
DiseaseAnalyticsWidget.displayName = "DiseaseAnalyticsWidget";
