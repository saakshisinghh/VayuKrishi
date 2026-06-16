"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CalendarClock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DiseaseTimeline as DiseaseTimelineType } from "../types/analysis.types";

const severityDot = {
  low: "bg-green-400",
  moderate: "bg-yellow-400",
  high: "bg-orange-400",
  critical: "bg-red-500",
};

interface DiseaseTimelineProps {
  timeline: DiseaseTimelineType;
}

export function DiseaseTimeline({ timeline }: DiseaseTimelineProps) {
  const t = useTranslations("diseaseDetection");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-base">{t("timeline.title")}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-5">
        {/* Stages */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[18px] top-5 h-[calc(100%-20px)] w-0.5 bg-border" />

          <div className="flex flex-col gap-5">
            {timeline.stages.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Dot */}
                <div
                  className={`relative z-10 mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    stage.isCurrentStage
                      ? "border-purple-500 bg-purple-100 dark:bg-purple-950/50"
                      : i < timeline.stages.findIndex((s) => s.isCurrentStage)
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-muted bg-background"
                  }`}
                >
                  {i < timeline.stages.findIndex((s) => s.isCurrentStage) ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : stage.isCurrentStage ? (
                    <span className="h-3 w-3 animate-pulse rounded-full bg-purple-500" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 rounded-xl border p-3 ${
                    stage.isCurrentStage
                      ? "border-purple-200 bg-purple-50/60 dark:border-purple-900 dark:bg-purple-950/20"
                      : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${stage.isCurrentStage ? "text-purple-800 dark:text-purple-200" : ""}`}>
                      {stage.name}
                      {stage.isCurrentStage && (
                        <Badge className="ml-2 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-[10px]">
                          {t("timeline.current")}
                        </Badge>
                      )}
                    </p>
                    <span className="flex-shrink-0 text-[10px] text-muted-foreground">
                      {t("timeline.day")} {stage.daysFromInfection}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{stage.description}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${severityDot[stage.severity]}`} />
                    <span className="text-[10px] capitalize text-muted-foreground">
                      {t(`severity.${stage.severity}`)} {t("timeline.severity")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Critical dates */}
        {timeline.criticalDates.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold">{t("timeline.criticalDates")}</p>
            <div className="flex flex-col gap-2">
              {timeline.criticalDates.map((date) => (
                <div
                  key={date.id}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                    date.actionRequired
                      ? "border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20"
                      : "border-border bg-muted/20"
                  }`}
                >
                  {date.actionRequired && (
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{date.label}</p>
                    <p className="text-xs text-muted-foreground">{date.description}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs font-semibold text-muted-foreground">
                    {date.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
