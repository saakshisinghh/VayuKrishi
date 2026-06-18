"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useWaterAnalytics } from "@/features/analytics/hooks/use-water-analytics";
import { useTaskAnalytics } from "@/features/analytics/hooks/use-task-analytics";
import { ChartSkeleton } from "./chart-skeleton";

// Water Analytics Widget
function WaterAnalyticsWidgetBase() {
  const t = useTranslations("analytics.widgets.water");
  const { data, isLoading } = useWaterAnalytics();

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="rounded-xl border border-border bg-card p-5" role="img" aria-label={t("ariaLabel")}>
      <h3 className="text-sm font-semibold text-foreground mb-1">{t("title")}</h3>
      <p className="text-xs text-muted-foreground mb-4">{t("subtitle")}</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data ?? []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}L`} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
          <Area type="monotone" dataKey="used" name={t("used")} stroke="#06b6d4" strokeWidth={2} fill="url(#waterGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export const WaterAnalyticsWidget = memo(WaterAnalyticsWidgetBase);
WaterAnalyticsWidget.displayName = "WaterAnalyticsWidget";

// Task Completion Widget
function TaskCompletionWidgetBase() {
  const t = useTranslations("analytics.widgets.tasks");
  const { data, isLoading } = useTaskAnalytics();

  if (isLoading) return <ChartSkeleton />;

  const completionRate = data?.completionRate ?? 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5" role="img" aria-label={t("ariaLabel")}>
      <h3 className="text-sm font-semibold text-foreground mb-1">{t("title")}</h3>
      <p className="text-xs text-muted-foreground mb-4">{t("subtitle")}</p>
      <div className="flex items-center justify-center gap-8">
        <div className="relative">
          <ResponsiveContainer width={180} height={180}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="90%"
              data={[{ value: completionRate, fill: "#10b981" }]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "hsl(var(--muted))" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{completionRate}%</span>
            <span className="text-xs text-muted-foreground">{t("complete")}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: t("completed"), value: data?.completed ?? 0, color: "bg-emerald-500" },
            { label: t("inProgress"), value: data?.inProgress ?? 0, color: "bg-amber-500" },
            { label: t("pending"), value: data?.pending ?? 0, color: "bg-muted-foreground" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} aria-hidden="true" />
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-foreground ml-auto pl-4">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const TaskCompletionWidget = memo(TaskCompletionWidgetBase);
TaskCompletionWidget.displayName = "TaskCompletionWidget";
