"use client";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-slate-800 rounded-xl" />
          <div className="h-4 w-36 bg-slate-800 rounded-full" />
        </div>
        <div className="w-9 h-9 bg-slate-800 rounded-xl" />
      </div>

      {/* Weather hero skeleton */}
      <div className="rounded-3xl bg-slate-800/70 h-72" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-slate-800/60 h-36" />
        ))}
      </div>

      {/* Two-column rows */}
      {[1, 2, 3].map((row) => (
        <div key={row} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-800/50 h-64" />
          <div className="rounded-2xl bg-slate-800/50 h-64" />
        </div>
      ))}
    </div>
  );
}

export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-white/80 text-lg">Something went wrong</p>
        <p className="text-sm text-white/40 mt-1">We couldn't load your dashboard data.</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
