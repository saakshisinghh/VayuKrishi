"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Microscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ANALYSIS_STEPS } from "../types/analysis.types";

interface DiseaseAnalysisLoaderProps {
  currentStepIndex: number;
}

export function DiseaseAnalysisLoader({
  currentStepIndex,
}: DiseaseAnalysisLoaderProps) {
  const t = useTranslations("diseaseDetection");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const overallProgress = Math.min(
    Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100),
    99
  );

  return (
    <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-900 dark:from-emerald-950/40 dark:to-teal-950/40">
      <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
        {/* Pulsing brain icon */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-emerald-400/40"
              animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <Microscope className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        {/* Current step label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              {t(ANALYSIS_STEPS[currentStepIndex]?.labelKey ?? "analysis.steps.upload")}
            </p>
            <p className="mt-1 text-sm text-emerald-700/70 dark:text-emerald-300/70">
              {t("analysis.pleaseWait")}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>{overallProgress}%</span>
            <span>
              {elapsedSeconds}s {t("analysis.elapsed")}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={{ width: "0%" }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="flex w-full max-w-xs flex-col gap-2">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-emerald-100 font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                    : isDone
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-emerald-600" />
                ) : (
                  <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground/30" />
                )}
                {t(step.labelKey)}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
