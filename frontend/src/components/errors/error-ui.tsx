"use client";

import { AlertTriangle, WifiOff, ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBaseProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  reset?: () => void;
  resetLabel?: string;
}

function ErrorBase({ title, description, icon: Icon, iconColor, iconBg, reset, resetLabel = "Try again" }: ErrorBaseProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[200px]" role="alert" aria-live="assertive">
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-7 h-7 ${iconColor}`} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
      {reset && (
        <Button variant="outline" size="sm" onClick={reset} className="gap-2">
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          {resetLabel}
        </Button>
      )}
    </div>
  );
}

interface FeatureErrorProps {
  error?: Error | null;
  reset?: () => void;
}

export function FeatureError({ error, reset }: FeatureErrorProps) {
  return (
    <ErrorBase
      title="Something went wrong"
      description={error?.message ?? "An unexpected error occurred. Please try again."}
      icon={AlertTriangle}
      iconColor="text-amber-600"
      iconBg="bg-amber-100 dark:bg-amber-950/30"
      reset={reset}
    />
  );
}

export function NetworkError({ reset }: { reset?: () => void }) {
  return (
    <ErrorBase
      title="No internet connection"
      description="Please check your network connection and try again."
      icon={WifiOff}
      iconColor="text-blue-600"
      iconBg="bg-blue-100 dark:bg-blue-950/30"
      reset={reset}
    />
  );
}

export function ServerError({ reset }: { reset?: () => void }) {
  return (
    <ErrorBase
      title="Server error"
      description="Our servers are having trouble. Please try again in a moment."
      icon={ServerCrash}
      iconColor="text-red-600"
      iconBg="bg-red-100 dark:bg-red-950/30"
      reset={reset}
    />
  );
}

export function OfflineError() {
  return (
    <ErrorBase
      title="You're offline"
      description="This feature requires an internet connection. Your cached data is still available."
      icon={WifiOff}
      iconColor="text-muted-foreground"
      iconBg="bg-muted"
    />
  );
}
