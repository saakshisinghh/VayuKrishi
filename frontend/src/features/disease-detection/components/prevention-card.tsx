"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Shield, CheckSquare, Square, TrendingDown, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PreventionPlan, ChecklistItem } from "../types/treatment.types";

const priorityConfig = {
  high: "border-red-200 bg-red-50/60 dark:border-red-900 dark:bg-red-950/20",
  medium: "border-yellow-200 bg-yellow-50/60 dark:border-yellow-900 dark:bg-yellow-950/20",
  low: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20",
};

interface PreventionCardProps {
  prevention: PreventionPlan;
}

export function PreventionCard({ prevention }: PreventionCardProps) {
  const t = useTranslations("diseaseDetection");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    prevention.monitoringChecklist
  );

  const toggleItem = (id: string) =>
    setChecklist((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );

  const completedCount = checklist.filter((i) => i.completed).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-base">{t("prevention.title")}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{t("prevention.subtitle")}</p>
      </CardHeader>

      <CardContent className="space-y-5 pb-5">
        {/* Preventive Actions */}
        <div>
          <p className="mb-3 text-sm font-semibold">{t("prevention.actions")}</p>
          <div className="flex flex-col gap-2">
            {prevention.actions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-start gap-3 rounded-xl border p-3 ${priorityConfig[action.priority]}`}
              >
                <span className="text-lg" role="img" aria-label={action.title}>
                  {action.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{action.title}</p>
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      {action.frequency}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Monitoring Checklist */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-semibold">{t("prevention.checklist")}</p>
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{checklist.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {checklist.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="h-auto justify-start gap-3 rounded-lg border px-3 py-2.5 text-left"
                onClick={() => toggleItem(item.id)}
              >
                {item.completed ? (
                  <CheckSquare className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                ) : (
                  <Square className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                )}
                <span
                  className={`flex-1 text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {item.task}
                </span>
                <Badge variant="outline" className="flex-shrink-0 text-[10px]">
                  {t(`prevention.frequency.${item.frequency}`)}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Risk Reduction */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-600" />
            <p className="text-sm font-semibold">{t("prevention.riskReduction")}</p>
          </div>
          <div className="flex flex-col gap-2">
            {prevention.futureRiskReduction.map((strategy) => (
              <div
                key={strategy.id}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5"
              >
                <span className="flex-1 text-sm">{strategy.strategy}</span>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  ↓{strategy.expectedReduction}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Next inspection */}
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/20">
          <CalendarCheck className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs text-muted-foreground">{t("prevention.nextInspection")}</p>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              {prevention.nextInspectionDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
