"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { History, ChevronRight, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiseaseHistory } from "../queries/disease-detection.queries";

const severityColor: Record<string, string> = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  moderate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

export function DiseaseHistoryCard() {
  const t = useTranslations("diseaseDetection");
  const router = useRouter();
  const { data, isLoading } = useDiseaseHistory({ limit: 5 });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">{t("history.title")}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-emerald-600"
          onClick={() => router.push("/disease-detection/history")}
        >
          {t("history.viewAll")}
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 pb-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))
        ) : !data?.items.length ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {t("history.empty")}
          </div>
        ) : (
          data.items.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex w-full items-center gap-3 rounded-xl border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40"
              onClick={() => router.push(`/disease-detection/${item.id}`)}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.diseaseName}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <Leaf className="h-5 w-5 text-emerald-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{item.diseaseName}</p>
                <p className="text-xs text-muted-foreground">{item.cropType} · {item.detectedAt}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className={`text-[10px] ${severityColor[item.severity]}`}>
                  {t(`severity.${item.severity}`)}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {item.confidenceScore}%
                </span>
              </div>
            </motion.button>
          ))
        )}
      </CardContent>
    </Card>
  );
}
