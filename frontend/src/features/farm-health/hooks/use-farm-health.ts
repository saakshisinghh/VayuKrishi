'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFarmHealth,
  fetchHealthScore,
  refreshHealthAnalysis,
} from '../services/farm-health.service';

const FARM_HEALTH_KEYS = {
  all: ['farm-health'] as const,
  health: (farmerId: string) => [...FARM_HEALTH_KEYS.all, farmerId] as const,
  score: (farmerId: string) => [...FARM_HEALTH_KEYS.all, 'score', farmerId] as const,
};

export function useFarmHealth(farmerId: string = 'current') {
  return useQuery({
    queryKey: FARM_HEALTH_KEYS.health(farmerId),
    queryFn: () => fetchFarmHealth(farmerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useHealthScore(farmerId: string = 'current') {
  return useQuery({
    queryKey: FARM_HEALTH_KEYS.score(farmerId),
    queryFn: () => fetchHealthScore(farmerId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useRefreshHealthAnalysis(farmerId: string = 'current') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => refreshHealthAnalysis(farmerId),
    onSuccess: (data) => {
      queryClient.setQueryData(FARM_HEALTH_KEYS.health(farmerId), data);
    },
  });
}
