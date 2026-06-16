"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { DiseaseSummaryCard } from "./disease-summary-card";
import { ConfidenceMeter } from "./confidence-meter";
import { SymptomsCard } from "./symptoms-card";
import { CauseAnalysisCard } from "./cause-analysis-card";
import { TreatmentPlanCard } from "./treatment-plan-card";
import { PreventionCard } from "./prevention-card";
import { OutbreakRiskCard } from "./outbreak-risk-card";
import { WeatherImpactCard } from "./weather-impact-card";
import { DiseaseTimeline } from "./disease-timeline";
import { FarmerActionCenter } from "./farmer-action-center";
import type { AnalysisResponse } from "../types/analysis.types";

interface DiseaseResultViewProps {
  result: AnalysisResponse;
  reportId: string;
}

export function DiseaseResultView({ result, reportId }: DiseaseResultViewProps) {
  const t = useTranslations("diseaseDetection");

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30"
      >
        <span className="text-xl">✅</span>
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            {t("result.analysisComplete")}
          </p>
          <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">
            {t("result.processedIn", { ms: result.processingTime })}
          </p>
        </div>
      </motion.div>

      {/* Summary + Confidence */}
      <DiseaseSummaryCard disease={result.disease} />

      <div className="grid gap-5 md:grid-cols-2">
        <ConfidenceMeter score={result.disease.confidenceScore} />
        <SymptomsCard symptoms={result.disease.symptoms} />
      </div>

      {/* Causes */}
      <CauseAnalysisCard causes={result.disease.causes} />

      {/* Treatment */}
      <TreatmentPlanCard treatment={result.treatment} />

      {/* Prevention */}
      <PreventionCard prevention={result.prevention} />

      {/* Outbreak + Weather */}
      <div className="grid gap-5 md:grid-cols-2">
        <OutbreakRiskCard outbreaks={result.outbreakRisk} />
        <WeatherImpactCard weather={result.weatherImpact} />
      </div>

      {/* Timeline */}
      <DiseaseTimeline timeline={result.timeline} />

      {/* Actions */}
      <FarmerActionCenter reportId={reportId} />
    </div>
  );
}
