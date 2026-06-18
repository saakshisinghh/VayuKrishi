"use client";

// Revenue Analytics Widget
import { memo } from "react";
import { useTranslations } from "next-intl";
import { ProfitTrendChart } from "./profit-trend-chart";

function RevenueAnalyticsWidgetBase() {
  return <ProfitTrendChart />;
}
export const RevenueAnalyticsWidget = memo(RevenueAnalyticsWidgetBase);
RevenueAnalyticsWidget.displayName = "RevenueAnalyticsWidget";
