"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCw, MapPinOff } from "lucide-react";

interface ErrorProps {
  onRetry?: () => void;
}

function BaseError({ icon: Icon, title, message, onRetry }: ErrorProps & { icon: React.ElementType; title: string; message: string }) {
  const t = useTranslations("common.error");
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/10" role="alert">
      <Icon className="h-8 w-8 text-red-400" aria-hidden />
      <div>
        <p className="font-semibold text-red-700 dark:text-red-400">{title}</p>
        <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          {t("retry")}
        </button>
      )}
    </div>
  );
}

export function MarketError({ onRetry }: ErrorProps) {
  const t = useTranslations("market.errors");
  return <BaseError icon={AlertCircle} title={t("marketTitle")} message={t("marketMessage")} onRetry={onRetry} />;
}

export function ForecastError({ onRetry }: ErrorProps) {
  const t = useTranslations("market.errors");
  return <BaseError icon={AlertCircle} title={t("forecastTitle")} message={t("forecastMessage")} onRetry={onRetry} />;
}

export function DemandError({ onRetry }: ErrorProps) {
  const t = useTranslations("market.errors");
  return <BaseError icon={AlertCircle} title={t("demandTitle")} message={t("demandMessage")} onRetry={onRetry} />;
}

export function MapError({ onRetry }: ErrorProps) {
  const t = useTranslations("market.errors");
  return <BaseError icon={MapPinOff} title={t("mapTitle")} message={t("mapMessage")} onRetry={onRetry} />;
}
