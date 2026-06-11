import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardOverview,
  fetchFarmHealthData,
  fetchMarketData,
  fetchWeatherData,
} from "../services/dashboard.service";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  weather: () => [...dashboardKeys.all, "weather"] as const,
  market: () => [...dashboardKeys.all, "market"] as const,
  health: () => [...dashboardKeys.all, "health"] as const,
};

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: fetchDashboardOverview,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchInterval: 10 * 60 * 1000, // 10 min
  });
}

export function useWeatherData() {
  return useQuery({
    queryKey: dashboardKeys.weather(),
    queryFn: fetchWeatherData,
    staleTime: 15 * 60 * 1000, // 15 min
    refetchInterval: 30 * 60 * 1000, // 30 min
  });
}

export function useMarketData() {
  return useQuery({
    queryKey: dashboardKeys.market(),
    queryFn: fetchMarketData,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 20 * 60 * 1000,
  });
}

export function useFarmHealthData() {
  return useQuery({
    queryKey: dashboardKeys.health(),
    queryFn: fetchFarmHealthData,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
