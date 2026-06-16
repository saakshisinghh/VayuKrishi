"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfidenceMeterProps {
  score: number; // 0–100
}

function getConfidenceLabel(score: number) {
  if (score >= 90) return { key: "confidence.veryHigh", color: "#10b981" };
  if (score >= 75) return { key: "confidence.high", color: "#3b82f6" };
  if (score >= 55) return { key: "confidence.moderate", color: "#f59e0b" };
  return { key: "confidence.low", color: "#ef4444" };
}

const SIZE = 160;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ConfidenceMeter({ score }: ConfidenceMeterProps) {
  const t = useTranslations("diseaseDetection");
  const [animatedScore, setAnimatedScore] = useState(0);
  const { key: labelKey, color } = getConfidenceLabel(score);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timeout);
  }, [score]);

  const offset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("confidence.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pb-6">
        {/* SVG circle */}
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-muted/30"
            />
            {/* Progress */}
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold"
              style={{ color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {Math.round(animatedScore)}%
            </motion.span>
            <span className="text-xs text-muted-foreground">
              {t("confidence.confidence")}
            </span>
          </div>
        </div>

        {/* Label + bar */}
        <div className="flex w-full flex-col items-center gap-2">
          <span
            className="rounded-full px-3 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {t(labelKey)}
          </span>
          {/* Scale reference */}
          <div className="relative h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-500">
            <motion.div
              className="absolute top-0 h-full w-1 rounded-full bg-white shadow-md"
              initial={{ left: "0%" }}
              animate={{ left: `${score}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ transform: "translateX(-50%)" }}
            />
          </div>
          <div className="flex w-full max-w-[200px] justify-between text-[10px] text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
