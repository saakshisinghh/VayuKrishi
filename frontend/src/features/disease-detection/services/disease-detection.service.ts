import { apiClient } from "@/lib/api/axios";
import type { DiseaseReport, DiseaseHistoryItem } from "../types/disease.types";

export interface UploadImageResponse {
  mediaId: string;
  url: string;
}

export const diseaseDetectionService = {
  /**
   * POST /uploads/image
   * Generic media upload — used for disease photos, profile pics, etc.
   * Returns the saved media document's _id (used as mediaId in detect()).
   */
  async uploadImage(file: File, farmId: string): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("farmId", farmId);
    const { data } = await apiClient.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { mediaId: data.data._id, url: data.data.url };
  },

  /**
   * POST /disease/detect
   * Single combined call: runs AI analysis on an already-uploaded image
   * AND saves the resulting report — there is no separate save step.
   */
  async analyzeDisease(
    farmId: string,
    mediaId: string,
    cropName: string
  ): Promise<DiseaseReport> {
    const { data } = await apiClient.post("/disease/detect", {
      farmId,
      mediaId,
      cropName,
    });
    return data.data;
  },

  /**
   * GET /disease/history
   */
  async getDiseaseHistory(params?: {
    page?: number;
    limit?: number;
    cropName?: string;
  }): Promise<{ items: DiseaseHistoryItem[]; total: number; page: number }> {
    const { data } = await apiClient.get("/disease/history", { params });
    // Backend's PaginatedResult shape is { data: T[], meta: { total, page, ... } }
    const result = data.data;
    return {
      items: result.data,
      total: result.meta.total,
      page: result.meta.page,
    };
  },

  /**
   * GET /disease/history/:id
   */
  async getDiseaseReport(reportId: string): Promise<DiseaseReport> {
    const { data } = await apiClient.get(`/disease/history/${reportId}`);
    return data.data;
  },

  /**
   * GET /disease/history/:id/download
   * Returns a plain-text report file (no PDF generation on the backend yet).
   */
  async downloadReport(reportId: string): Promise<Blob> {
    const { data } = await apiClient.get(
      `/disease/history/${reportId}/download`,
      { responseType: "blob" }
    );
    return data;
  },

  /**
   * POST /disease/history/:id/share
   * Returns a shareable link only — does not send via WhatsApp/SMS/email
   * (no messaging integration on the backend yet).
   */
  async shareReport(reportId: string): Promise<{ shareUrl: string }> {
    const { data } = await apiClient.post(
      `/disease/history/${reportId}/share`
    );
    return data.data;
  },
};