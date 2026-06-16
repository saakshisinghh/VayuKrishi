"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Leaf, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DetectedDisease } from "../types/disease.types";

const severityConfig = {
  low: {
    color: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800",
    icon: CheckCircle,
    label: "severity.low",
  },
  moderate: {
    color: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-800",
    icon: AlertTriangle,
    label: "severity.moderate",
  },
  high: {
    color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800",
    icon: AlertTriangle,
    label: "severity.high",
  },
  critical: {
    color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800",
    icon: XCircle,
    label: "severity.critical",
  },
};

interface DiseaseSummaryCardProps {
  disease: DetectedDisease;
}

export function DiseaseSummaryCard({ disease }: DiseaseSummaryCardProps) {
  const t = useTranslations("diseaseDetection");
  const config = severityConfig[disease.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 pb-4 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
            <Leaf className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{disease.name}</CardTitle>
            <p className="mt-0.5 text-sm italic text-muted-foreground">
              {disease.scientificName}
            </p>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          {/* Severity */}
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 ${config.color}`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                {t("summary.severity")}
              </p>
              <p className="text-base font-bold">{t(config.label)}</p>
            </div>
          </div>

          {/* Affected parts */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("summary.affectedParts")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {disease.affectedParts.map((part) => (
                <Badge key={part} variant="secondary" className="text-xs">
                  {part}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex gap-3 rounded-xl border bg-blue-50/60 p-4 dark:bg-blue-950/20 sm:col-span-2">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
            <p className="text-sm leading-relaxed text-foreground/80">
              {disease.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
