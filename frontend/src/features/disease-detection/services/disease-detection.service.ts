import { apiClient } from "@/lib/api/axios";
import type { AnalysisResponse } from "../types/analysis.types";
import type { DiseaseReport, DiseaseHistoryItem } from "../types/disease.types";

export interface UploadImageResponse {
  uploadId: string;
  imageUrl: string;
  thumbnailUrl: string;
}

export interface SaveReportRequest {
  reportId: string;
  notes?: string;
  treated?: boolean;
}

export const diseaseDetectionService = {
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await apiClient.post<UploadImageResponse>(
      "/disease-detection/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  async analyzeDisease(
    uploadId: string,
    options?: { cropType?: string; lat?: number; lng?: number }
  ): Promise<AnalysisResponse> {
    const { data } = await apiClient.post<AnalysisResponse>(
      "/disease-detection/analyze",
      { uploadId, ...options }
    );
    return data;
  },

  async getDiseaseHistory(params?: {
    page?: number;
    limit?: number;
    cropType?: string;
  }): Promise<{ items: DiseaseHistoryItem[]; total: number; page: number }> {
    const { data } = await apiClient.get("/disease-detection/history", { params });
    return data;
  },

  async getDiseaseReport(reportId: string): Promise<DiseaseReport> {
    const { data } = await apiClient.get<DiseaseReport>(
      `/disease-detection/reports/${reportId}`
    );
    return data;
  },

  async saveDiseaseReport(
    payload: SaveReportRequest
  ): Promise<{ success: boolean; savedId: string }> {
    const { data } = await apiClient.post("/disease-detection/reports/save", payload);
    return data;
  },

  async downloadReport(reportId: string): Promise<Blob> {
    const { data } = await apiClient.get(
      `/disease-detection/reports/${reportId}/download`,
      { responseType: "blob" }
    );
    return data;
  },

  async shareReport(
    reportId: string,
    method: "whatsapp" | "sms" | "email"
  ): Promise<{ shareUrl: string }> {
    const { data } = await apiClient.post(
      `/disease-detection/reports/${reportId}/share`,
      { method }
    );
    return data;
  },
};