'use client';

import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

function BaseErrorState({
  title,
  description,
  onRetry,
  icon: Icon = AlertTriangle,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
  icon?: typeof AlertTriangle;
}) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-900/30 bg-red-950/10 p-8 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
        <Icon className="h-7 w-7 text-red-400" aria-hidden="true" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>
      <p className="mb-5 max-w-sm text-sm text-slate-500">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try Again
        </button>
      )}
    </div>
  );
}

export function FarmHealthError({ onRetry }: ErrorStateProps) {
  return (
    <BaseErrorState
      icon={Wifi}
      title="Unable to load farm health data"
      description="We couldn't fetch your farm health analysis. This may be a network issue. Please try again."
      onRetry={onRetry}
    />
  );
}

export function SchemeError({ onRetry }: ErrorStateProps) {
  return (
    <BaseErrorState
      title="Scheme data unavailable"
      description="Government scheme information could not be loaded. Please check your connection and try again."
      onRetry={onRetry}
    />
  );
}

export function PlannerError({ onRetry }: ErrorStateProps) {
  return (
    <BaseErrorState
      title="Farm planner unavailable"
      description="Your seasonal plan could not be loaded right now. Please try again in a moment."
      onRetry={onRetry}
    />
  );
}
