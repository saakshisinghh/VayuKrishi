'use client';

export function FarmHealthSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading farm health data">
      {/* Hero skeleton */}
      <div className="h-44 rounded-2xl bg-slate-800/60" />

      {/* Score + trend row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-72 rounded-2xl bg-slate-800/60" />
        <div className="h-72 rounded-2xl bg-slate-800/60" />
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-80 rounded-2xl bg-slate-800/60" />
        <div className="h-80 rounded-2xl bg-slate-800/60" />
        <div className="h-80 rounded-2xl bg-slate-800/60" />
      </div>

      {/* Improvement panel */}
      <div className="h-64 rounded-2xl bg-slate-800/60" />
    </div>
  );
}

export function SchemeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading schemes data">
      <div className="h-40 rounded-2xl bg-slate-800/60" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-slate-800/60" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-slate-800/60" />
    </div>
  );
}

export function PlannerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading planner data">
      <div className="h-40 rounded-2xl bg-slate-800/60" />
      <div className="h-32 rounded-2xl bg-slate-800/60" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-96 rounded-2xl bg-slate-800/60" />
        <div className="h-96 rounded-2xl bg-slate-800/60" />
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading timeline">
      <div className="flex gap-3 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 w-32 flex-shrink-0 rounded-xl bg-slate-800/60" />
        ))}
      </div>
    </div>
  );
}
