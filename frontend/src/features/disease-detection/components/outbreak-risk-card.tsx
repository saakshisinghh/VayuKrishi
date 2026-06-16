"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AlertOctagon, MapPin, Biohazard, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OutbreakRisk } from "../types/outbreak.types";

const riskConfig = {
  low: { color: "text-green-600", bg: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800", badgeClass: "bg-green-100 text-green-700" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800", badgeClass: "bg-yellow-100 text-yellow-700" },
  high: { color: "text-orange-600", bg: "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800", badgeClass: "bg-orange-100 text-orange-700" },
  critical: { color: "text-red-600", bg: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800", badgeClass: "bg-red-100 text-red-700" },
};

interface OutbreakRiskCardProps {
  outbreaks: OutbreakRisk[];
}

export function OutbreakRiskCard({ outbreaks }: OutbreakRiskCardProps) {
  const t = useTranslations("diseaseDetection");

  const hasHighRisk = outbreaks.some((o) =>
    ["high", "critical"].includes(o.riskLevel)
  );

  return (
    <Card className={hasHighRisk ? "border-orange-300 dark:border-orange-800" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Biohazard
            className={`h-5 w-5 ${hasHighRisk ? "text-orange-500" : "text-muted-foreground"}`}
          />
          <CardTitle className="text-base">{t("outbreak.title")}</CardTitle>
          {hasHighRisk && (
            <Badge className="ml-auto bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
              <AlertOctagon className="mr-1 h-3 w-3" />
              {t("outbreak.alertActive")}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t("outbreak.subtitle")}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-5">
        {outbreaks.length === 0 ? (
          <div className="rounded-xl border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            {t("outbreak.noneDetected")}
          </div>
        ) : (
          outbreaks.map((outbreak, i) => {
            const cfg = riskConfig[outbreak.riskLevel];
            return (
              <motion.div
                key={outbreak.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-xl border p-4 ${cfg.bg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {outbreak.diseaseName}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {outbreak.affectedRegion} · {outbreak.direction}
                    </div>
                  </div>
                  <Badge className={`flex-shrink-0 text-xs ${cfg.badgeClass}`}>
                    {t(`outbreak.risk.${outbreak.riskLevel}`)}
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-white/60 p-2 text-center dark:bg-black/20">
                    <p className="text-[10px] text-muted-foreground">{t("outbreak.distance")}</p>
                    <p className="text-sm font-bold">
                      {outbreak.distance} {outbreak.distanceUnit}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2 text-center dark:bg-black/20">
                    <p className="text-[10px] text-muted-foreground">{t("outbreak.cases")}</p>
                    <p className="text-sm font-bold">{outbreak.reportedCases}</p>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2 text-center dark:bg-black/20">
                    <p className="text-[10px] text-muted-foreground">{t("outbreak.crops")}</p>
                    <p className="truncate text-xs font-medium">
                      {outbreak.affectedCrops.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-right text-[10px] text-muted-foreground">
                  {t("outbreak.updated")}: {outbreak.lastUpdated}
                </p>
              </motion.div>
            );
          })
        )}

        <button className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400">
          {t("outbreak.viewMap")}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </CardContent>
    </Card>
  );
}
