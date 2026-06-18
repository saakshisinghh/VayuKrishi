// chart-skeleton.tsx
"use client";

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="h-4 w-40 bg-muted rounded mb-2" />
      <div className="h-3 w-60 bg-muted rounded mb-6" />
      <div className="h-[240px] bg-muted rounded" />
    </div>
  );
}
