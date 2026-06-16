"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  BookmarkPlus,
  Bot,
  ClipboardList,
  Check,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useDownloadReport,
  useShareReport,
  useSaveDiseaseReport,
} from "../queries/disease-detection.queries";
import { useDiseaseDetectionStore } from "../store/disease-detection.store";

interface FarmerActionCenterProps {
  reportId: string;
}

export function FarmerActionCenter({ reportId }: FarmerActionCenterProps) {
  const t = useTranslations("diseaseDetection");
  const router = useRouter();
  const savedToHistory = useDiseaseDetectionStore((s) => s.savedToHistory);
  const setSaved = useDiseaseDetectionStore((s) => s.setSavedToHistory);

  const download = useDownloadReport();
  const share = useShareReport();
  const save = useSaveDiseaseReport();

  const handleSave = async () => {
    if (savedToHistory) return;
    await save.mutateAsync({ reportId });
    setSaved(true);
  };

  const handleShare = async (method: "whatsapp" | "sms" | "email") => {
    const res = await share.mutateAsync({ reportId, method });
    if (res.shareUrl) window.open(res.shareUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-900 dark:from-emerald-950/30 dark:to-teal-950/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("actions.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("actions.subtitle")}</p>
        </CardHeader>

        <CardContent className="grid gap-3 pb-5 sm:grid-cols-2">
          {/* Download Report */}
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={() => download.mutate(reportId)}
            disabled={download.isPending}
          >
            {download.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5 text-emerald-600" />
            )}
            <span className="text-sm font-medium">{t("actions.download")}</span>
            <span className="text-xs text-muted-foreground">{t("actions.downloadSub")}</span>
          </Button>

          {/* Share */}
          <div className="flex flex-col gap-1.5">
            <p className="px-1 text-xs font-medium text-muted-foreground">
              {t("actions.shareVia")}
            </p>
            <div className="flex gap-2">
              {(["whatsapp", "sms", "email"] as const).map((method) => (
                <Button
                  key={method}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 text-xs"
                  onClick={() => handleShare(method)}
                  disabled={share.isPending}
                >
                  {method === "whatsapp" ? "📱" : method === "sms" ? "💬" : "📧"}
                  {t(`actions.share.${method}`)}
                </Button>
              ))}
            </div>
          </div>

          {/* Save to history */}
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={handleSave}
            disabled={save.isPending || savedToHistory}
          >
            {save.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : savedToHistory ? (
              <Check className="h-5 w-5 text-emerald-500" />
            ) : (
              <BookmarkPlus className="h-5 w-5 text-purple-600" />
            )}
            <span className="text-sm font-medium">
              {savedToHistory ? t("actions.saved") : t("actions.saveHistory")}
            </span>
            <span className="text-xs text-muted-foreground">{t("actions.saveHistorySub")}</span>
          </Button>

          {/* Ask AI Assistant */}
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={() => router.push("/assistant")}
          >
            <Bot className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">{t("actions.askAssistant")}</span>
            <span className="text-xs text-muted-foreground">{t("actions.askAssistantSub")}</span>
          </Button>

          {/* Generate Farm Plan */}
          <Button
            className="h-auto flex-col gap-2 bg-emerald-600 py-4 hover:bg-emerald-700 sm:col-span-2"
            onClick={() => router.push("/planner?source=disease-detection&report=" + reportId)}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="text-sm font-medium">{t("actions.generateFarmPlan")}</span>
            <span className="text-xs text-emerald-200">{t("actions.generateFarmPlanSub")}</span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
