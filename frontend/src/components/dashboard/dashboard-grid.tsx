'use client';
import { cn } from "@/lib/utils/helpers";

interface DashboardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function DashboardGrid({ children, cols = 3, className }: DashboardGridProps) {
  return (
    <div className={cn("dashboard-grid", `dashboard-grid--${cols}`, className)}>
      {children}
      <style jsx>{`
        .dashboard-grid { display: grid; gap: 16px; width: 100%; }
        .dashboard-grid--1 { grid-template-columns: 1fr; }
        .dashboard-grid--2 { grid-template-columns: repeat(2, 1fr); }
        .dashboard-grid--3 { grid-template-columns: repeat(3, 1fr); }
        .dashboard-grid--4 { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1024px) {
          .dashboard-grid--4, .dashboard-grid--3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .dashboard-grid--2, .dashboard-grid--3, .dashboard-grid--4 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
