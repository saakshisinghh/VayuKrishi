"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { useMarketStore } from "@/store/market-store";
import { useMarketLocations } from "../queries/market.queries";
import { MapSkeleton } from "./market-skeleton";
import { MapError } from "./market-error";

// Lazy load Leaflet to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map-inner"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export function MarketMap() {
  const t = useTranslations("market.map");
  const { selectedRegion, setSelectedRegion } = useMarketStore();
  const { data: locations, isLoading, isError, refetch } = useMarketLocations(selectedRegion);

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-500" aria-hidden />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          aria-label={t("selectRegion")}
        >
          <option value="maharashtra">Maharashtra</option>
          <option value="gujarat">Gujarat</option>
          <option value="punjab">Punjab</option>
          <option value="karnataka">Karnataka</option>
          <option value="tamil_nadu">Tamil Nadu</option>
          <option value="rajasthan">Rajasthan</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> {t("apmc")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> {t("wholesale")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-orange-400" /> {t("retail")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-violet-500" /> {t("export")}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700" style={{ height: 420 }}>
        {isLoading ? (
          <MapSkeleton />
        ) : isError ? (
          <MapError onRetry={refetch} />
        ) : (
          <LeafletMap locations={locations ?? []} />
        )}
      </div>
    </section>
  );
}
