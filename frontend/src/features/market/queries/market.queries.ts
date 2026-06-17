import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketService } from "../services/market.service";
import { forecastService } from "../services/forecast.service";
import { demandService } from "../services/demand.service";
import type { MarketFilters } from "../types/market.types";

export const MARKET_KEYS = {
  all: ["market"] as const,
  prices: (filters?: Partial<MarketFilters>) => ["market", "prices", filters] as const,
  summary: () => ["market", "summary"] as const,
  forecast: (cropId: string) => ["market", "forecast", cropId] as const,
  sellRec: (cropId: string) => ["market", "sell-recommendation", cropId] as const,
  demand: (cropId?: string) => ["market", "demand", cropId] as const,
  demandSummary: () => ["market", "demand-summary"] as const,
  bestMarket: (cropId: string, region?: string) => ["market", "best", cropId, region] as const,
  alerts: () => ["market", "alerts"] as const,
  locations: (region?: string) => ["market", "locations", region] as const,
  comparison: (cropIds: string[]) => ["market", "comparison", cropIds] as const,
  seasonal: (cropId: string) => ["market", "seasonal", cropId] as const,
};

export function useMarketPrices(filters?: Partial<MarketFilters>) {
  return useQuery({
    queryKey: MARKET_KEYS.prices(filters),
    queryFn: () => marketService.getMarketPrices(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useMarketSummary() {
  return useQuery({
    queryKey: MARKET_KEYS.summary(),
    queryFn: () => marketService.getMarketSummary(),
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
  });
}

export function useMarketForecast(cropId: string) {
  return useQuery({
    queryKey: MARKET_KEYS.forecast(cropId),
    queryFn: () => forecastService.getForecasts(cropId),
    enabled: !!cropId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useSellRecommendation(cropId: string) {
  return useQuery({
    queryKey: MARKET_KEYS.sellRec(cropId),
    queryFn: () => forecastService.getSellRecommendation(cropId),
    enabled: !!cropId,
    staleTime: 1000 * 60 * 15,
  });
}

export function useDemandInsights(cropId?: string) {
  return useQuery({
    queryKey: MARKET_KEYS.demand(cropId),
    queryFn: () => demandService.getDemandInsights(cropId),
    staleTime: 1000 * 60 * 10,
  });
}

export function useDemandSummary() {
  return useQuery({
    queryKey: MARKET_KEYS.demandSummary(),
    queryFn: () => demandService.getDemandSummary(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useBestMarket(cropId: string, region?: string) {
  return useQuery({
    queryKey: MARKET_KEYS.bestMarket(cropId, region),
    queryFn: () => marketService.getBestMarket(cropId, region),
    enabled: !!cropId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useMarketAlerts() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: MARKET_KEYS.alerts(),
    queryFn: () => marketService.getMarketAlerts(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  const markRead = useMutation({
    mutationFn: (alertId: string) => marketService.markAlertRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKET_KEYS.alerts() });
    },
  });

  return { ...query, markRead };
}

export function useMarketLocations(region?: string) {
  return useQuery({
    queryKey: MARKET_KEYS.locations(region),
    queryFn: () => marketService.getMarketLocations(region),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCropComparison(cropIds: string[]) {
  return useQuery({
    queryKey: MARKET_KEYS.comparison(cropIds),
    queryFn: () => forecastService.getCropComparison(cropIds),
    enabled: cropIds.length > 0,
    staleTime: 1000 * 60 * 15,
  });
}

export function useSeasonalTrend(cropId: string) {
  return useQuery({
    queryKey: MARKET_KEYS.seasonal(cropId),
    queryFn: () => forecastService.getSeasonalTrend(cropId),
    enabled: !!cropId,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
