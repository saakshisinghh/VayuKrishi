"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, WifiOff, ImageOff, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  onRetry?: () => void;
  message?: string;
}

function ErrorBase({
  icon: Icon,
  titleKey,
  descKey,
  message,
  onRetry,
  iconClass = "text-destructive",
}: ErrorProps & {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  iconClass?: string;
}) {
  const t = useTranslations("diseaseDetection");
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <Icon className={`h-8 w-8 ${iconClass}`} />
        </div>
        <div>
          <p className="font-semibold text-foreground">{t(titleKey)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {message ?? t(descKey)}
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("errors.retry")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function UploadError({ onRetry, message }: ErrorProps) {
  return (
    <ErrorBase
      icon={ImageOff}
      titleKey="errors.upload.title"
      descKey="errors.upload.desc"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function AnalysisError({ onRetry, message }: ErrorProps) {
  return (
    <ErrorBase
      icon={AlertCircle}
      titleKey="errors.analysis.title"
      descKey="errors.analysis.desc"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function NetworkError({ onRetry }: ErrorProps) {
  return (
    <ErrorBase
      icon={WifiOff}
      titleKey="errors.network.title"
      descKey="errors.network.desc"
      onRetry={onRetry}
      iconClass="text-orange-500"
    />
  );
}
