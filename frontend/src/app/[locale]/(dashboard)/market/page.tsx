import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { MarketHero } from "@/features/market/components/market-hero";
import { LiveMarketTable } from "@/features/market/components/live-market-table";
import { PriceForecastPanel } from "@/features/market/components/price-forecast-panel";
import { TrendAnalysisCard } from "@/features/market/components/trend-analysis-card";
import { DemandInsightPanel } from "@/features/market/components/demand-insight-panel";
import { BestMarketCard } from "@/features/market/components/best-market-card";
import { SellDecisionCard } from "@/features/market/components/sell-decision-card";
import { MarketMap } from "@/features/market/components/market-map";
import { CropComparisonPanel } from "@/features/market/components/crop-comparison-panel";
import { MarketAlertsWidget } from "@/features/market/components/market-alerts-widget";
import {
  MarketSummarySkeleton,
  MarketTableSkeleton,
  ForecastSkeleton,
  DemandSkeleton,
  MapSkeleton,
} from "@/features/market/components/market-skeleton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "market" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function MarketPage() {
  return (
    <main
      className="min-h-screen space-y-10 px-4 py-6 sm:px-6 lg:px-8"
      aria-label="Market Intelligence Platform"
    >
      <Suspense fallback={<MarketSummarySkeleton />}>
        <MarketHero />
      </Suspense>

      <Suspense fallback={<MarketTableSkeleton />}>
        <LiveMarketTable />
      </Suspense>

      <Suspense fallback={<ForecastSkeleton />}>
        <PriceForecastPanel />
      </Suspense>

      <Suspense fallback={<ForecastSkeleton />}>
        <TrendAnalysisCard />
      </Suspense>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <Suspense fallback={<DemandSkeleton />}>
          <DemandInsightPanel />
        </Suspense>
        <Suspense fallback={<MarketSummarySkeleton />}>
          <BestMarketCard />
        </Suspense>
      </div>

      <Suspense fallback={<ForecastSkeleton />}>
        <SellDecisionCard />
      </Suspense>

      <Suspense fallback={<MapSkeleton />}>
        <MarketMap />
      </Suspense>

      <Suspense fallback={<MarketSummarySkeleton />}>
        <CropComparisonPanel />
      </Suspense>

      <Suspense fallback={<MarketSummarySkeleton />}>
        <MarketAlertsWidget />
      </Suspense>
    </main>
  );
}