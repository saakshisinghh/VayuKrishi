'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEligibleSchemes,
  fetchSchemeRecommendations,
  fetchApplications,
  submitApplication,
} from '../services/schemes.service';

const SCHEME_KEYS = {
  all: ['schemes'] as const,
  eligible: (farmerId: string) => [...SCHEME_KEYS.all, 'eligible', farmerId] as const,
  recommendations: (farmerId: string) => [...SCHEME_KEYS.all, 'recommendations', farmerId] as const,
  applications: (farmerId: string) => [...SCHEME_KEYS.all, 'applications', farmerId] as const,
};

export function useEligibleSchemes(farmerId: string = 'current') {
  return useQuery({
    queryKey: SCHEME_KEYS.eligible(farmerId),
    queryFn: () => fetchEligibleSchemes(farmerId),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useSchemeRecommendations(farmerId: string = 'current') {
  return useQuery({
    queryKey: SCHEME_KEYS.recommendations(farmerId),
    queryFn: () => fetchSchemeRecommendations(farmerId),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useSchemeApplications(farmerId: string = 'current') {
  return useQuery({
    queryKey: SCHEME_KEYS.applications(farmerId),
    queryFn: () => fetchApplications(farmerId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function useSubmitApplication(farmerId: string = 'current') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schemeId: string) => submitApplication(schemeId, farmerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEME_KEYS.applications(farmerId) });
    },
  });
}
