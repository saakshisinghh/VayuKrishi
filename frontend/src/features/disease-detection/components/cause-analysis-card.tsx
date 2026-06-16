"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cause } from "../types/disease.types";

interface CauseAnalysisCardProps {
  causes: Cause[];
}

export function CauseAnalysisCard({ causes }: CauseAnalysisCardProps) {
  const t = useTranslations("diseaseDetection");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("causes.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("causes.subtitle")}</p>
      </CardHeader>
      <CardContent className="grid gap-3 pb-5 sm:grid-cols-2">
        {causes.map((cause, i) => (
          <motion.div
            key={cause.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3 dark:border-orange-900/50 dark:bg-orange-950/20"
          >
            <span className="text-xl" role="img" aria-label={cause.name}>
              {cause.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                {cause.name}
              </p>
              <p className="mt-0.5 text-xs text-orange-700/80 dark:text-orange-300/70">
                {cause.description}
              </p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
