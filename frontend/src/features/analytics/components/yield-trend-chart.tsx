"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useYieldTrend } from "@/features/analytics/hooks/use-yield-trend";
import { ChartSkeleton } from "@/features/analytics/components/chart-skeleton";

function YieldTrendChartBase() {
  const t = useTranslations("analytics.charts.yieldTrend");
  const { data, isLoading } = useYieldTrend();

  const chartData = useMemo(() => data ?? [], [data]);
  const maxYield = useMemo(
    () => Math.max(...chartData.map((d) => d.yield ?? 0)),
    [chartData]
  );

  if (isLoading) return <ChartSkeleton />;

  return (
    <div
      className="rounded-xl border border-border bg-card p-5"
      role="img"
      aria-label={t("ariaLabel")}
    >
      <h3 className="text-sm font-semibold text-foreground mb-1">{t("title")}</h3>
      <p className="text-xs text-muted-foreground mb-4">{t("subtitle")}</p>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="crop"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}q`}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted)/0.3)" }}
            formatter={(value: number) => [`${value} quintals`, t("yield")]}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="yield" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.yield === maxYield ? "#10b981" : "#6366f1"}
                fillOpacity={entry.yield === maxYield ? 1 : 0.65}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const YieldTrendChart = memo(YieldTrendChartBase);
YieldTrendChart.displayName = "YieldTrendChart";
