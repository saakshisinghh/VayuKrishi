"use client";

import { motion } from "framer-motion";
import { useWeatherData, useMarketData, useFarmHealthData, useDashboardOverview } from "../queries/dashboard.query";
import { WeatherHero, WeatherSkeleton, WeatherError } from "./weather-hero";
import { FarmSnapshotCard, FarmSnapshotSkeleton } from "./farm-snapshot-card";
import { AIRecommendationPanel, AISkeleton } from "./ai-recommendation-card";
import { DiseaseAlertCenter } from "./disease-alert-card";
import { MarketWidget, MarketSkeleton, MarketError } from "./market-widget";
import { FarmHealthCard, HealthSkeleton } from "./farm-health-card";
import { SchemeWidget } from "./scheme-widget";
import { VoiceAssistantWidget } from "./voice-assistant-widget";

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.section>
  );
}

export function DashboardGrid() {
  const weather = useWeatherData();
  const market = useMarketData();
  const health = useFarmHealthData();
  const overview = useDashboardOverview();

  return (
    <div className="w-full space-y-6">

      {/* 1. Weather Hero */}
      <Section delay={0}>
        {weather.isPending ? (
          <WeatherSkeleton />
        ) : weather.isError ? (
          <WeatherError onRetry={() => weather.refetch()} />
        ) : weather.data ? (
          <WeatherHero data={weather.data} />
        ) : null}
      </Section>

      {/* 2. Farm Snapshot KPI strip */}
      <Section delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {overview.isPending
            ? Array.from({ length: 4 }).map((_, i) => <FarmSnapshotSkeleton key={i} />)
            : overview.data
            ? Array.from({ length: 4 }).map((_, i) => (
                <FarmSnapshotCard key={i} data={overview.data!.farmSnapshot} index={i} />
              ))
            : null}
        </div>
      </Section>

      {/* 3+4. AI Recommendations + Disease Alerts */}
      <Section delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {overview.isPending ? (
              <AISkeleton />
            ) : overview.data ? (
              <AIRecommendationPanel recommendations={overview.data.aiRecommendations} />
            ) : null}
          </div>
          <div>
            {overview.isPending ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : overview.data ? (
              <DiseaseAlertCenter alerts={overview.data.diseaseAlerts} />
            ) : null}
          </div>
        </div>
      </Section>

      {/* 5+6. Market + Farm Health */}
      <Section delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {market.isPending ? (
              <MarketSkeleton />
            ) : market.isError ? (
              <MarketError onRetry={() => market.refetch()} />
            ) : market.data ? (
              <MarketWidget data={market.data} />
            ) : null}
          </div>
          <div>
            {health.isPending ? (
              <HealthSkeleton />
            ) : health.data ? (
              <FarmHealthCard data={health.data} />
            ) : null}
          </div>
        </div>
      </Section>

      {/* 7+8. Schemes + Voice */}
      <Section delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {overview.isPending ? (
              <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            ) : overview.data ? (
              <SchemeWidget schemes={overview.data.schemes} />
            ) : null}
          </div>
          <div>
            <VoiceAssistantWidget />
          </div>
        </div>
      </Section>

    </div>
  );
}