"use client";

import { create } from "zustand";
import type { AnalysisResponse } from "../types/analysis.types";
import type { DiseaseStatus } from "../types/disease.types";

interface DiseaseDetectionStore {
  status: DiseaseStatus;
  selectedFile: File | null;
  previewUrl: string | null;
  analysisResult: AnalysisResponse | null;
  currentStepIndex: number;
  reportId: string | null;
  savedToHistory: boolean;

  setFile: (file: File | null) => void;
  setStatus: (status: DiseaseStatus) => void;
  setAnalysisResult: (result: AnalysisResponse) => void;
  setCurrentStepIndex: (index: number) => void;
  setSavedToHistory: (saved: boolean) => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as DiseaseStatus,
  selectedFile: null,
  previewUrl: null,
  analysisResult: null,
  currentStepIndex: 0,
  reportId: null,
  savedToHistory: false,
};

export const useDiseaseDetectionStore = create<DiseaseDetectionStore>(
  (set, get) => ({
    ...initialState,

    setFile: (file) => {
      const prev = get().previewUrl;
      if (prev) URL.revokeObjectURL(prev);
      set({
        selectedFile: file,
        previewUrl: file ? URL.createObjectURL(file) : null,
        status: file ? "idle" : "idle",
        analysisResult: null,
        currentStepIndex: 0,
        savedToHistory: false,
      });
    },

    setStatus: (status) => set({ status }),

    setAnalysisResult: (result) =>
      set({
        analysisResult: result,
        reportId: result.reportId,
        status: "complete",
      }),

    setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

    setSavedToHistory: (saved) => set({ savedToHistory: saved }),

    reset: () => {
      const prev = get().previewUrl;
      if (prev) URL.revokeObjectURL(prev);
      set(initialState);
    },
  })
);
