"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useProfitTrend } from "@/features/analytics/hooks/use-profit-trend";
import { ChartSkeleton } from "@/features/analytics/components/chart-skeleton";
import { formatCurrency } from "@/lib/utils/helpers";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = memo(({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
});
CustomTooltip.displayName = "CustomTooltip";

function ProfitTrendChartBase() {
  const t = useTranslations("analytics.charts.profitTrend");
  const { data, isLoading } = useProfitTrend();

  const chartData = useMemo(() => data ?? [], [data]);

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
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            formatter={(value) => (
              <span className="text-muted-foreground">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="actual"
            name={t("actual")}
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#actualGradient)"
          />
          <Area
            type="monotone"
            dataKey="projected"
            name={t("projected")}
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="url(#projectedGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export const ProfitTrendChart = memo(ProfitTrendChartBase);
ProfitTrendChart.displayName = "ProfitTrendChart";
