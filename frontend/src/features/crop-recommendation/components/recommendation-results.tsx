'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CropRecommendationCard } from './recommendation-card';
import { RecommendationReasoningCard } from './reasoning-card';
import { ProfitSimulator } from './profit-simulator';
import { RiskAnalysisCard } from './risk-analysis-card';
import { FarmPlanTimeline } from './farm-plan-timeline';
import { MarketInsightWidget } from './market-insight-widget';
import { useProfitSimulation, useFarmPlan } from '../queries/crop-recommendation.query';
import type { RecommendationResponse } from '../types/crop-recommendation.types';
import type { FarmProfile } from '../types/crop-recommendation.types';

// ─── Recommendation Results ───────────────────────────────────────────────────
interface RecommendationResultsProps {
  data: RecommendationResponse;
  farmProfile: FarmProfile;
  onReset: () => void;
}

export function RecommendationResults({
  data,
  farmProfile,
  onReset,
}: RecommendationResultsProps) {
  const t = useTranslations('cropRecommendation');
  const [selectedCropId, setSelectedCropId] = useState<string>(
    data.recommendations[0]?.id ?? ''
  );

  const selectedCrop =
    data.recommendations.find((r) => r.id === selectedCropId) ?? data.recommendations[0];

  // Profit simulation
  const {
    data: profitData,
    isLoading: profitLoading,
    isError: profitError,
    refetch: profitRefetch,
  } = useProfitSimulation(
    data.recommendations.map((r) => r.id),
    farmProfile.landDetails.size,
    farmProfile.landDetails.unit
  );

  // Farm plan for selected crop
  const {
    data: farmPlanData,
    isLoading: farmPlanLoading,
    isError: farmPlanError,
    refetch: farmPlanRefetch,
  } = useFarmPlan(selectedCropId, farmProfile);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Reset button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('results.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('results.subtitle', { count: data.recommendations.length })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          aria-label={t('results.startOver')}
          className="gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          {t('results.startOver')}
        </Button>
      </div>

      {/* ─── 1. Top 3 Crop Cards ───────────────────────────────────────── */}
      <section aria-labelledby="crop-cards-heading">
        <h3
          id="crop-cards-heading"
          className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {t('results.recommendedCrops')}
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {data.recommendations.map((rec, index) => (
            <CropRecommendationCard
              key={rec.id}
              recommendation={rec}
              index={index}
              isSelected={selectedCropId === rec.id}
              onSelect={setSelectedCropId}
            />
          ))}
        </div>
      </section>

      {/* ─── 2. AI Reasoning ──────────────────────────────────────────── */}
      {selectedCrop && (
        <section aria-labelledby="reasoning-heading">
          <h3
            id="reasoning-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"
          >
            {t('results.aiReasoning')}
          </h3>
          <RecommendationReasoningCard
            cropName={selectedCrop.cropName}
            reasons={selectedCrop.reasons}
          />
        </section>
      )}

      {/* ─── 3. Profit Simulator ──────────────────────────────────────── */}
      <section aria-labelledby="profit-heading">
        <h3
          id="profit-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"
        >
          {t('results.profitSimulator')}
        </h3>
        <ProfitSimulator
          data={profitData}
          isLoading={profitLoading}
          isError={profitError}
          onRetry={profitRefetch}
        />
      </section>

      {/* ─── 4. Risk Analysis ─────────────────────────────────────────── */}
      {selectedCrop && (
        <section aria-labelledby="risk-heading">
          <h3
            id="risk-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"
          >
            {t('results.riskAnalysis')}
          </h3>
          <RiskAnalysisCard recommendation={selectedCrop} />
        </section>
      )}

      {/* ─── 5. Farm Plan Timeline ────────────────────────────────────── */}
      <section aria-labelledby="farm-plan-heading">
        <h3
          id="farm-plan-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"
        >
          {t('results.farmPlan')}
        </h3>
        <FarmPlanTimeline
          data={farmPlanData}
          isLoading={farmPlanLoading}
          isError={farmPlanError}
          onRetry={farmPlanRefetch}
        />
      </section>

      {/* ─── 6. Market Insight ────────────────────────────────────────── */}
      <section aria-labelledby="market-heading">
        <h3
          id="market-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"
        >
          {t('results.marketInsight')}
        </h3>
        <MarketInsightWidget recommendations={data.recommendations} />
      </section>
    </motion.div>
  );
}
