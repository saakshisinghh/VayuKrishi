"use client";

import { memo } from "react";
import { YieldTrendChart } from "./yield-trend-chart";

export const YieldAnalyticsWidget = memo(function YieldAnalyticsWidget() {
  return <YieldTrendChart />;
});
YieldAnalyticsWidget.displayName = "YieldAnalyticsWidget";
