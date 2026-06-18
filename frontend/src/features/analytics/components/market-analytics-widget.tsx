"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMarketAnalytics } from "@/features/analytics/hooks/use-market-analytics";
import { ChartSkeleton } from "./chart-skeleton";

function MarketAnalyticsWidgetBase() {
  const t = useTranslations("analytics.widgets.market");
  const { data, isLoading } = useMarketAnalytics();

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="rounded-xl border border-border bg-card p-5" role="img" aria-label={t("ariaLabel")}>
      <h3 className="text-sm font-semibold text-foreground mb-1">{t("title")}</h3>
      <p className="text-xs text-muted-foreground mb-4">{t("subtitle")}</p>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
          <Bar dataKey="sold" name={t("sold")} fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
          <Line type="monotone" dataKey="avgPrice" name={t("avgPrice")} stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export const MarketAnalyticsWidget = memo(MarketAnalyticsWidgetBase);
MarketAnalyticsWidget.displayName = "MarketAnalyticsWidget";
