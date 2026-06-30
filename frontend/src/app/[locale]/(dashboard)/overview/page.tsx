import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardGrid } from "@/features/dashboard/components/dashboard-grid";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard.header" });
  return {
    title: "Overview | Vayukrishi",
    description: "Your farm's real-time intelligence dashboard — weather, market, AI recommendations, and health.",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function OverviewPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #060d18 0%, #080f1c 40%, #06111e 100%)",
      }}
    >
      {/* Subtle background texture */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 10%, rgba(52, 211, 153, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(96, 165, 250, 0.3) 0%, transparent 50%)
            `,
          }}
        />
        {/* Very subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Page header */}
        <DashboardHeader  />

        {/* Dashboard content grid */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardGrid />
        </Suspense>
      </div>
    </main>
  );
}
