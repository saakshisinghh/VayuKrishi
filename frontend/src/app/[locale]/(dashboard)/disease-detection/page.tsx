"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";

import { DiseaseDetectionHero } from "@/features/disease-detection/components/disease-detection-hero";
import { DiseaseUploadCard } from "@/features/disease-detection/components/disease-upload-card";
import { ImagePreviewCard } from "@/features/disease-detection/components/image-preview-card";
import { DiseaseAnalysisLoader } from "@/features/disease-detection/components/disease-analysis-loader";
import { DiseaseResultView } from "@/features/disease-detection/components/disease-result-view";
import { DiseaseHistoryCard } from "@/features/disease-detection/components/disease-history-card";
import { AnalysisError, NetworkError } from "@/features/disease-detection/components/error-states";

import { useDiseaseDetectionStore } from "@/features/disease-detection/store/disease-detection.store";
import { useDiseaseDetection } from "@/features/disease-detection/queries/disease-detection.queries";
import { ANALYSIS_STEPS } from "@/features/disease-detection/types/analysis.types";

export default function DiseaseDetectionPage() {
  const t = useTranslations("diseaseDetection");

  const {
    status,
    selectedFile,
    previewUrl,
    analysisResult,
    currentStepIndex,
    reportId,
    setFile,
    setStatus,
    setAnalysisResult,
    setCurrentStepIndex,
    reset,
  } = useDiseaseDetectionStore();

  const { analyze, isAnalyzing, analysisError } = useDiseaseDetection();
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Step animation during analysis
  useEffect(() => {
    if (status === "analyzing") {
      let step = 0;
      stepTimerRef.current = setInterval(() => {
        step += 1;
        if (step >= ANALYSIS_STEPS.length) {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          return;
        }
        setCurrentStepIndex(step);
      }, 1400);
    }
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [status, setCurrentStepIndex]);

  // Scroll to result when done
  useEffect(() => {
    if (status === "complete") {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [status]);

  const handleFileSelected = useCallback(
    (file: File) => {
      setFile(file);
      setStatus("idle");
    },
    [setFile, setStatus]
  );

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    setStatus("analyzing");
    setCurrentStepIndex(0);
    try {
      const { result } = await analyze(selectedFile);
      setAnalysisResult(result);
    } catch {
      setStatus("error" as any);
    }
  }, [selectedFile, analyze, setStatus, setCurrentStepIndex, setAnalysisResult]);

  const isNetworkError =
    analysisError instanceof TypeError &&
    analysisError.message === "Failed to fetch";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-6">
      {/* Hero */}
      <DiseaseDetectionHero />

      {/* Upload or Preview */}
      <AnimatePresence mode="wait">
        {status === "idle" && !selectedFile && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <DiseaseUploadCard onFileSelected={handleFileSelected} />
          </motion.div>
        )}

        {status === "idle" && selectedFile && previewUrl && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <ImagePreviewCard
              previewUrl={previewUrl}
              fileName={selectedFile.name}
              fileSize={selectedFile.size}
              onReplace={reset}
              onRemove={reset}
              onAnalyze={handleAnalyze}
            />
          </motion.div>
        )}

        {status === "analyzing" && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <DiseaseAnalysisLoader currentStepIndex={currentStepIndex} />
          </motion.div>
        )}

        {(status as string) === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isNetworkError ? (
              <NetworkError onRetry={handleAnalyze} />
            ) : (
              <AnalysisError
                onRetry={handleAnalyze}
                message={
                  analysisError instanceof Error
                    ? analysisError.message
                    : undefined
                }
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {status === "complete" && analysisResult && reportId && (
          <motion.div
            key="result"
            ref={resultRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DiseaseResultView result={analysisResult} reportId={reportId} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* History (always shown at bottom) */}
      <DiseaseHistoryCard />
    </div>
  );
}
