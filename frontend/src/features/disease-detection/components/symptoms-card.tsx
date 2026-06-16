"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Symptom } from "../types/disease.types";

interface SymptomsCardProps {
  symptoms: Symptom[];
}

export function SymptomsCard({ symptoms }: SymptomsCardProps) {
  const t = useTranslations("diseaseDetection");
  const detected = symptoms.filter((s) => s.detected);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">{t("symptoms.title")}</CardTitle>
        <Badge variant="outline" className="text-xs">
          {detected.length}/{symptoms.length} {t("symptoms.detected")}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-5">
        {symptoms.map((symptom, i) => (
          <motion.div
            key={symptom.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              symptom.detected
                ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
                : "border-border bg-muted/20 opacity-60"
            }`}
          >
            {symptom.detected ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            )}
            <div>
              <p
                className={`text-sm font-medium ${
                  symptom.detected
                    ? "text-emerald-800 dark:text-emerald-200"
                    : "text-muted-foreground"
                }`}
              >
                {symptom.name}
              </p>
              {symptom.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {symptom.description}
                </p>
              )}
            </div>
            {symptom.detected && (
              <Badge className="ml-auto flex-shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                {t("symptoms.confirmed")}
              </Badge>
            )}
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
