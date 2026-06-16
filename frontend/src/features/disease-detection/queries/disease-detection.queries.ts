"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { diseaseDetectionService } from "../services/disease-detection.service";
import type { SaveReportRequest } from "../services/disease-detection.service";

export const DISEASE_QUERY_KEYS = {
  all: ["disease-detection"] as const,
  history: (params?: object) =>
    [...DISEASE_QUERY_KEYS.all, "history", params] as const,
  report: (id: string) => [...DISEASE_QUERY_KEYS.all, "report", id] as const,
};

// ─── Upload + Analyze (combined mutation) ───────────────────────────────────
export function useDiseaseDetection() {
  const uploadMutation = useMutation({
    mutationFn: (file: File) => diseaseDetectionService.uploadImage(file),
  });

  const analyzeMutation = useMutation({
    mutationFn: ({
      uploadId,
      options,
    }: {
      uploadId: string;
      options?: { cropType?: string; lat?: number; lng?: number };
    }) => diseaseDetectionService.analyzeDisease(uploadId, options),
  });

  const analyze = async (
    file: File,
    options?: { cropType?: string; lat?: number; lng?: number }
  ) => {
    const upload = await uploadMutation.mutateAsync(file);
    const result = await analyzeMutation.mutateAsync({
      uploadId: upload.uploadId,
      options,
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
  cropType?: string;
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

// ─── Save Report ─────────────────────────────────────────────────────────────
export function useSaveDiseaseReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveReportRequest) =>
      diseaseDetectionService.saveDiseaseReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISEASE_QUERY_KEYS.history() });
    },
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
      a.download = `disease-report-${reportId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

// ─── Share Report ─────────────────────────────────────────────────────────────
export function useShareReport() {
  return useMutation({
    mutationFn: ({
      reportId,
      method,
    }: {
      reportId: string;
      method: "whatsapp" | "sms" | "email";
    }) => diseaseDetectionService.shareReport(reportId, method),
  });
}
