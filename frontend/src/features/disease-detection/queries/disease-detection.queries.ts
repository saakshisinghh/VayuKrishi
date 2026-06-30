"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { diseaseDetectionService } from "../services/disease-detection.service";

export const DISEASE_QUERY_KEYS = {
  all: ["disease-detection"] as const,
  history: (params?: object) =>
    [...DISEASE_QUERY_KEYS.all, "history", params] as const,
  report: (id: string) => [...DISEASE_QUERY_KEYS.all, "report", id] as const,
};

// ─── Upload + Analyze (combined mutation) ───────────────────────────────────
export function useDiseaseDetection() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: ({ file, farmId }: { file: File; farmId: string }) =>
      diseaseDetectionService.uploadImage(file, farmId),
  });

  const analyzeMutation = useMutation({
    mutationFn: ({
      farmId,
      mediaId,
      cropName,
    }: {
      farmId: string;
      mediaId: string;
      cropName: string;
    }) => diseaseDetectionService.analyzeDisease(farmId, mediaId, cropName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISEASE_QUERY_KEYS.history() });
    },
  });

  const analyze = async (file: File, farmId: string, cropName: string) => {
    const upload = await uploadMutation.mutateAsync({ file, farmId });
    const result = await analyzeMutation.mutateAsync({
      farmId,
      mediaId: upload.mediaId,
      cropName,
    });
    return { upload, result };
  };

  return {
    analyze,
    isUploading: uploadMutation.isPending,
    isAnalyzing: analyzeMutation.isPending,
    isPending: uploadMutation.isPending || analyzeMutation.isPending,
    uploadError: uploadMutation.error,
    analysisError: analyzeMutation.error,
    reset: () => {
      uploadMutation.reset();
      analyzeMutation.reset();
    },
  };
}

// ─── Disease History ─────────────────────────────────────────────────────────
export function useDiseaseHistory(params?: {
  page?: number;
  limit?: number;
  cropName?: string;
}) {
  return useQuery({
    queryKey: DISEASE_QUERY_KEYS.history(params),
    queryFn: () => diseaseDetectionService.getDiseaseHistory(params),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Single Report ───────────────────────────────────────────────────────────
export function useDiseaseReport(reportId: string) {
  return useQuery({
    queryKey: DISEASE_QUERY_KEYS.report(reportId),
    queryFn: () => diseaseDetectionService.getDiseaseReport(reportId),
    enabled: !!reportId,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Download Report ─────────────────────────────────────────────────────────
export function useDownloadReport() {
  return useMutation({
    mutationFn: (reportId: string) =>
      diseaseDetectionService.downloadReport(reportId),
    onSuccess: (blob, reportId) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `disease-report-${reportId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

// ─── Share Report ─────────────────────────────────────────────────────────────
export function useShareReport() {
  return useMutation({
    mutationFn: (reportId: string) =>
      diseaseDetectionService.shareReport(reportId),
  });
}