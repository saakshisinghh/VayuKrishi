"use client";

interface AnalyticsSkeletonProps {
  section: "hero" | "kpi" | "chart";
}

export function AnalyticsSkeleton({ section }: AnalyticsSkeletonProps) {
  if (section === "hero") {
    return (
      <div className="animate-pulse">
        <div className="h-7 w-48 bg-muted rounded mb-2" />
        <div className="h-4 w-72 bg-muted rounded mb-5" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-4 h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (section === "kpi") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-muted/30 h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="h-4 w-40 bg-muted rounded mb-2" />
      <div className="h-3 w-60 bg-muted rounded mb-6" />
      <div className="h-[240px] bg-muted rounded" />
    </div>
  );
}
