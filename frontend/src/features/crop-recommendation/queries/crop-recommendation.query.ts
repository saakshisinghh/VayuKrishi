import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { cropRecommendationService } from '../services/crop-recommendation.service';
import type { FarmProfile } from '../types/crop-recommendation.types';
import type { RecommendationResponse } from '../types/crop-recommendation.types';
import type { ProfitSimulationResponse } from '../types/profit.types';
import type { FarmPlanResponse } from '../types/farm-plan.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const cropRecommendationKeys = {
  all: ['crop-recommendation'] as const,
  recommendations: (profileHash: string) =>
    [...cropRecommendationKeys.all, 'recommendations', profileHash] as const,
  profitSimulation: (cropIds: string[], landSize: number) =>
    [...cropRecommendationKeys.all, 'profit', cropIds.join(','), landSize] as const,
  farmPlan: (cropId: string) =>
    [...cropRecommendationKeys.all, 'farm-plan', cropId] as const,
};

// ─── useCropRecommendation ────────────────────────────────────────────────────
export function useCropRecommendation(): UseMutationResult<
  RecommendationResponse,
  Error,
  FarmProfile
> {
  return useMutation({
    mutationFn: (farmProfile: FarmProfile) =>
      cropRecommendationService.getRecommendations(farmProfile),
    onSuccess: (data) => {
      console.info('[CropRec] Recommendations fetched', data.recommendations.length);
    },
  });
}

// ─── useProfitSimulation ──────────────────────────────────────────────────────
export function useProfitSimulation(
  cropIds: string[],
  landSize: number,
  landUnit: string,
  enabled = true
) {
  return useQuery<ProfitSimulationResponse, Error>({
    queryKey: cropRecommendationKeys.profitSimulation(cropIds, landSize),
    queryFn: () =>
      cropRecommendationService.getProfitSimulation(cropIds, landSize, landUnit),
    enabled: enabled && cropIds.length > 0 && landSize > 0,
    staleTime: 5 * 60 * 1000,   // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

// ─── useFarmPlan ──────────────────────────────────────────────────────────────
export function useFarmPlan(
  cropId: string,
  farmProfile: FarmProfile | null,
  enabled = true
) {
  return useQuery<FarmPlanResponse, Error>({
    queryKey: cropRecommendationKeys.farmPlan(cropId),
    queryFn: () =>
      cropRecommendationService.getFarmPlan(cropId, farmProfile!),
    enabled: enabled && !!cropId && !!farmProfile,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}
