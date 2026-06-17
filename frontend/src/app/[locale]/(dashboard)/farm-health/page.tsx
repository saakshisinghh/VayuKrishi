'use client';

import { Suspense } from 'react';
import { useFarmHealth, useRefreshHealthAnalysis } from '@/features/farm-health/hooks/use-farm-health';
import { FarmHealthHero } from '@/features/farm-health/components/farm-health-hero';
import { FarmHealthScoreCard } from '@/features/farm-health/components/farm-health-score-card';
import { SoilHealthCard } from '@/features/farm-health/components/soil-health-card';
import { WaterEfficiencyCard } from '@/features/farm-health/components/water-efficiency-card';
import { DiseaseRiskCard } from '@/features/farm-health/components/disease-risk-card';
import { FarmImprovementPanel } from '@/features/farm-health/components/farm-improvement-panel';
import { HealthTrendChart } from '@/features/farm-health/components/health-trend-chart';
import { FarmHealthSkeleton } from '@/features/farm-health/components/loading-skeletons';
import { FarmHealthError } from '@/features/farm-health/components/error-states';

function FarmHealthContent() {
  const { data, isLoading, isError, refetch } = useFarmHealth();
  const refresh = useRefreshHealthAnalysis();

  if (isLoading) return <FarmHealthSkeleton />;
  if (isError || !data) return <FarmHealthError onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <FarmHealthHero
        score={data.score}
        onRefresh={() => refresh.mutate()}
        isRefreshing={refresh.isPending}
      />

      {/* Score breakdown + Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FarmHealthScoreCard breakdown={data.breakdown} />
        <HealthTrendChart trend={data.trend} />
      </div>

      {/* Soil / Water / Disease */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SoilHealthCard soilHealth={data.soilHealth} />
        <WaterEfficiencyCard waterEfficiency={data.waterEfficiency} />
        <DiseaseRiskCard diseaseRisk={data.diseaseRisk} />
      </div>

      {/* Improvement recommendations */}
      <FarmImprovementPanel recommendations={data.recommendations} />
    </div>
  );
}

export default function FarmHealthPage() {
  return (
    <main className="min-h-screen bg-[#080d08] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<FarmHealthSkeleton />}>
          <FarmHealthContent />
        </Suspense>
      </div>
    </main>
  );
}
