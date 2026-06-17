"use client";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  );
}

export function MarketSummarySkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading...">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketTableSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading table...">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 px-4 py-3 dark:bg-gray-800">
          <div className="flex gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-16" />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-8 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-16" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading forecast...">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 p-5 dark:border-gray-800 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 rounded-xl border border-gray-100 p-5 dark:border-gray-800">
          <Skeleton className="h-52 w-full rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  );
}

export function DemandSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading demand data...">
      <Skeleton className="h-7 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 space-y-2">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800" aria-busy="true" aria-label="Loading map...">
      <div className="text-center space-y-2">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading map…</p>
      </div>
    </div>
  );
}
