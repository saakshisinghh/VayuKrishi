import { useQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/lib/queries/analytics";
import {
  fetchKPIMetrics,
  fetchProfitTrend,
  fetchYieldTrend,
  fetchDiseaseAnalytics,
  fetchMarketAnalytics,
  fetchWaterAnalytics,
  fetchTaskAnalytics,
} from "@/lib/api/analytics";

export const useKPIMetrics = () =>
  useQuery({ queryKey: analyticsKeys.kpi(), queryFn: fetchKPIMetrics, staleTime: 5 * 60 * 1000 });

export const useProfitTrend = () =>
  useQuery({ queryKey: analyticsKeys.profitTrend(), queryFn: fetchProfitTrend, staleTime: 10 * 60 * 1000 });

export const useYieldTrend = () =>
  useQuery({ queryKey: analyticsKeys.yieldTrend(), queryFn: fetchYieldTrend, staleTime: 10 * 60 * 1000 });

export const useDiseaseAnalytics = () =>
  useQuery({ queryKey: analyticsKeys.disease(), queryFn: fetchDiseaseAnalytics, staleTime: 10 * 60 * 1000 });

export const useMarketAnalytics = () =>
  useQuery({ queryKey: analyticsKeys.market(), queryFn: fetchMarketAnalytics, staleTime: 5 * 60 * 1000 });

export const useWaterAnalytics = () =>
  useQuery({ queryKey: analyticsKeys.water(), queryFn: fetchWaterAnalytics, staleTime: 10 * 60 * 1000 });

export const useTaskAnalytics = () =>
  useQuery({ queryKey: analyticsKeys.tasks(), queryFn: fetchTaskAnalytics, staleTime: 2 * 60 * 1000 });
