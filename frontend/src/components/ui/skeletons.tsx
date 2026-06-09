"use client";

import { cn } from "@/lib/utils/helpers";

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("skeleton", className)} aria-hidden="true" style={style}>
      <style jsx>{`
        .skeleton {
          background: var(--color-skeleton-bg, rgba(0,0,0,0.07));
          border-radius: 10px;
          animation: sk-pulse 1.6s ease-in-out infinite;
        }
        @keyframes sk-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton" aria-busy="true" aria-label="Loading...">
      <Skeleton style={{ height: "18px", width: "40%", marginBottom: "12px" }} />
      <Skeleton style={{ height: "36px", width: "60%", marginBottom: "8px" }} />
      <Skeleton style={{ height: "14px", width: "30%" }} />
      <style jsx>{`
        .card-skeleton {
          background: var(--color-card-bg, #fff);
          border: 1px solid var(--color-border-subtle);
          border-radius: 16px;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page...">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <Skeleton style={{ width: 48, height: 48, borderRadius: 14 }} />
        <div style={{ flex: 1 }}>
          <Skeleton style={{ height: 22, width: "220px", marginBottom: 8 }} />
          <Skeleton style={{ height: 14, width: "320px" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[1,2,3].map((i) => <CardSkeleton key={i} />)}
      </div>
      <Skeleton style={{ height: 200, borderRadius: 16 }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="table-skeleton" aria-busy="true" aria-label="Loading table...">
      <Skeleton style={{ height: 40, marginBottom: 2 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} style={{ height: 52, marginBottom: 2, opacity: 1 - i * 0.1 }} />
      ))}
      <style jsx>{`
        .table-skeleton { border-radius: 14px; overflow: hidden; border: 1px solid var(--color-border-subtle); }
      `}</style>
    </div>
  );
}

export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="chart-skeleton" aria-busy="true" aria-label="Loading chart...">
      <Skeleton style={{ height: "16px", width: "120px", marginBottom: "16px" }} />
      <div className="chart-skeleton__bars">
        {[60,85,45,95,70,55,80].map((h, i) => (
          <Skeleton key={i} style={{ flex: 1, height: `${h}%`, alignSelf: "flex-end", borderRadius: "6px 6px 0 0" }} />
        ))}
      </div>
      <style jsx>{`
        .chart-skeleton {
          background: var(--color-card-bg, #fff);
          border: 1px solid var(--color-border-subtle);
          border-radius: 16px; padding: 20px; height: ${height}px;
        }
        .chart-skeleton__bars { display: flex; align-items: flex-end; gap: 8px; height: calc(100% - 44px); }
      `}</style>
    </div>
  );
}
