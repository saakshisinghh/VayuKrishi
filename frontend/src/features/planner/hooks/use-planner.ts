'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSeasonalPlan,
  fetchAIFarmPlan,
  fetchTaskProgress,
  updateTaskStatus,
  fetchPlannerSummary,
} from '../services/planner.service';
import type { FarmTask } from '../types/planner.types';

const PLANNER_KEYS = {
  all: ['planner'] as const,
  seasonal: (farmerId: string) => [...PLANNER_KEYS.all, 'seasonal', farmerId] as const,
  aiPlan: (farmerId: string) => [...PLANNER_KEYS.all, 'ai-plan', farmerId] as const,
  progress: (farmerId: string) => [...PLANNER_KEYS.all, 'progress', farmerId] as const,
  summary: (farmerId: string) => [...PLANNER_KEYS.all, 'summary', farmerId] as const,
};

export function useSeasonalPlan(farmerId: string = 'current') {
  return useQuery({
    queryKey: PLANNER_KEYS.seasonal(farmerId),
    queryFn: () => fetchSeasonalPlan(farmerId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useAIFarmPlan(farmerId: string = 'current') {
  return useQuery({
    queryKey: PLANNER_KEYS.aiPlan(farmerId),
    queryFn: () => fetchAIFarmPlan(farmerId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useTaskProgress(farmerId: string = 'current') {
  return useQuery({
    queryKey: PLANNER_KEYS.progress(farmerId),
    queryFn: () => fetchTaskProgress(farmerId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function usePlannerSummary(farmerId: string = 'current') {
  return useQuery({
    queryKey: PLANNER_KEYS.summary(farmerId),
    queryFn: () => fetchPlannerSummary(farmerId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function useUpdateTaskStatus(farmerId: string = 'current') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: FarmTask['status'] }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANNER_KEYS.progress(farmerId) });
      queryClient.invalidateQueries({ queryKey: PLANNER_KEYS.seasonal(farmerId) });
    },
  });
}
