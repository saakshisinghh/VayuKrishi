import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { AnalyticsHero } from "@/features/analytics/components/analytics-hero";
import { KPICards } from "@/features/analytics/components/kpi-cards";
import { RevenueAnalyticsWidget } from "@/features/analytics/components/revenue-analytics-widget";
import { YieldAnalyticsWidget } from "@/features/analytics/components/yield-analytics-widget";
import { DiseaseAnalyticsWidget } from "@/features/analytics/components/disease-analytics-widget";
import { MarketAnalyticsWidget } from "@/features/analytics/components/market-analytics-widget";
import { WaterAnalyticsWidget } from "@/features/analytics/components/water-analytics-widget";
import { TaskCompletionWidget } from "@/features/analytics/components/task-completion-widget";
import { AnalyticsSkeleton } from "@/features/analytics/components/analytics-skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("analytics");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto">
      <Suspense fallback={<AnalyticsSkeleton section="hero" />}>
        <AnalyticsHero />
      </Suspense>

      <Suspense fallback={<AnalyticsSkeleton section="kpi" />}>
        <KPICards />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<AnalyticsSkeleton section="chart" />}>
          <RevenueAnalyticsWidget />
        </Suspense>
        <Suspense fallback={<AnalyticsSkeleton section="chart" />}>
          <YieldAnalyticsWidget />
        </Suspense>
        <Suspense fallback={<AnalyticsSkeleton section="chart" />}>
          <DiseaseAnalyticsWidget />
        </Suspense>
        <Suspense fallback={<AnalyticsSkeleton section="chart" />}>
          <MarketAnalyticsWidget />
        </Suspense>
        <Suspense fallback={<AnalyticsSkeleton section="chart" />}>
          <WaterAnalyticsWidget />
        </Suspense>
        <Suspense fallback={<AnalyticsSkeleton section="chart" />}>
          <TaskCompletionWidget />
        </Suspense>
      </div>
    </div>
  );
}
