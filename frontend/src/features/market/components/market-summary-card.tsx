"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/helpers";

interface MarketSummaryCardProps {
  label: string;
  value: string | number;
  sub?: string;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function MarketSummaryCard({ label, value, sub, className, trend }: MarketSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900",
        className
      )}
      role="region"
      aria-label={label}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={cn(
          "mt-1 text-xl font-bold",
          trend === "up" && "text-emerald-600 dark:text-emerald-400",
          trend === "down" && "text-red-600 dark:text-red-400",
          (!trend || trend === "neutral") && "text-gray-900 dark:text-white"
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
    </div>
  );
}
