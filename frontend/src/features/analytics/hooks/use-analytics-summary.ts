// use-analytics-summary.ts
import { useQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/lib/queries/analytics";
import { fetchAnalyticsSummary } from "@/lib/api/analytics";

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: analyticsKeys.summary(),
    queryFn: fetchAnalyticsSummary,
    staleTime: 5 * 60 * 1000,
  });
}
