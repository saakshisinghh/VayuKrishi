'use client';
import { cn } from "@/lib/utils/helpers";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const widths = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", full: "100%" };

export function PageContainer({ children, className, maxWidth = "xl" }: PageContainerProps) {
  return (
    <div className={cn("page-container", className)} style={{ maxWidth: widths[maxWidth] }}>
      {children}
      <style jsx>{`
        .page-container { width: 100%; margin: 0 auto; }
      `}</style>
    </div>
  );
}
