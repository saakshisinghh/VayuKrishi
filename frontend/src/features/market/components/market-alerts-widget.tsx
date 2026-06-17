"use client";

import { useTranslations } from "next-intl";
import { Bell, TrendingUp, TrendingDown, AlertTriangle, Info, X, CheckCircle2 } from "lucide-react";
import { useMarketAlerts } from "../queries/market.queries";
import { MarketSummarySkeleton } from "./market-skeleton";
import { MarketError } from "./market-error";
import { cn } from "@/lib/utils/helpers";
import type { MarketAlert } from "../types/market.types";

const SEVERITY_CONFIG = {
  info: {
    icon: Info,
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-200 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  critical: {
    icon: AlertTriangle,
    border: "border-red-200 dark:border-red-800",
    bg: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
} as const;

const TYPE_ICON = {
  price_increase: TrendingUp,
  price_decrease: TrendingDown,
  demand_high: TrendingUp,
  opportunity: CheckCircle2,
  warning: AlertTriangle,
};

function MarketAlertCard({ alert, onDismiss }: { alert: MarketAlert; onDismiss: (id: string) => void }) {
  const t = useTranslations("market.alerts");
  const config = SEVERITY_CONFIG[alert.severity];
  const AlertIcon = config.icon;
  const TypeIcon = TYPE_ICON[alert.type] ?? Info;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-xl border p-4 transition-opacity",
        config.border,
        config.bg,
        alert.read && "opacity-60"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={cn("mt-0.5 shrink-0", config.iconColor)}>
        <TypeIcon className="h-4 w-4" aria-hidden />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", config.badge)}>
            {t(`severity.${alert.severity}`)}
          </span>
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{alert.crop}</span>
          {alert.changePercent !== undefined && (
            <span className={cn(
              "text-xs font-semibold",
              alert.changePercent > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {alert.changePercent > 0 ? "+" : ""}{alert.changePercent.toFixed(1)}%
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
        <p className="text-xs text-gray-600 dark:text-gray-300">{alert.message}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <button
        onClick={() => onDismiss(alert.id)}
        className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200/50 hover:text-gray-600 dark:hover:bg-gray-700/50"
        aria-label={t("dismiss")}
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}

export function MarketAlertsWidget() {
  const t = useTranslations("market.alerts");
  const { data: alerts, isLoading, isError, refetch, markRead } = useMarketAlerts();

  if (isLoading) return <MarketSummarySkeleton />;
  if (isError) return <MarketError onRetry={refetch} />;

  const unread = alerts?.filter((a) => !a.read).length ?? 0;

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unread}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        </div>
        {unread > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t("unreadCount", { count: unread })}
          </span>
        )}
      </div>

      {!alerts?.length ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" aria-hidden />
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("noAlerts")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Critical first */}
          {["critical", "warning", "info"].map((severity) =>
            alerts
              .filter((a) => a.severity === severity)
              .map((alert) => (
                <MarketAlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={(id) => markRead.mutate(id)}
                />
              ))
          )}
        </div>
      )}
    </section>
  );
}
