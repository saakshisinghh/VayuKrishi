import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MarketFilters } from "@/features/market/types/market.types";

interface MarketStore {
  selectedCrop: string;
  selectedCropName: string;
  selectedMarket: string;
  selectedRegion: string;
  forecastPeriod: "7d" | "30d";
  filters: MarketFilters;
  comparisonCrops: string[];
  setSelectedCrop: (cropId: string, cropName?: string) => void;
  setSelectedMarket: (marketId: string) => void;
  setSelectedRegion: (region: string) => void;
  setForecastPeriod: (period: "7d" | "30d") => void;
  setFilters: (filters: Partial<MarketFilters>) => void;
  resetFilters: () => void;
  addComparisonCrop: (cropId: string) => void;
  removeComparisonCrop: (cropId: string) => void;
  clearComparisonCrops: () => void;
}

const defaultFilters: MarketFilters = {
  search: "",
  state: "",
  crop: "",
  sortBy: "change",
  sortOrder: "desc",
  page: 1,
  pageSize: 20,
};

export const useMarketStore = create<MarketStore>()(
  persist(
    (set) => ({
      selectedCrop: "tomato",
      selectedCropName: "Tomato",
      selectedMarket: "",
      selectedRegion: "maharashtra",
      forecastPeriod: "7d",
      filters: defaultFilters,
      comparisonCrops: ["soybean", "cotton", "tomato", "wheat"],

      setSelectedCrop: (cropId, cropName) =>
        set({ selectedCrop: cropId, selectedCropName: cropName ?? cropId }),

      setSelectedMarket: (marketId) => set({ selectedMarket: marketId }),

      setSelectedRegion: (region) => set({ selectedRegion: region }),

      setForecastPeriod: (period) => set({ forecastPeriod: period }),

      setFilters: (partial) =>
        set((state) => ({ filters: { ...state.filters, ...partial, page: 1 } })),

      resetFilters: () => set({ filters: defaultFilters }),

      addComparisonCrop: (cropId) =>
        set((state) => ({
          comparisonCrops:
            state.comparisonCrops.includes(cropId) || state.comparisonCrops.length >= 4
              ? state.comparisonCrops
              : [...state.comparisonCrops, cropId],
        })),

      removeComparisonCrop: (cropId) =>
        set((state) => ({
          comparisonCrops: state.comparisonCrops.filter((c) => c !== cropId),
        })),

      clearComparisonCrops: () => set({ comparisonCrops: [] }),
    }),
    {
      name: "market-store",
      partialize: (state) => ({
        selectedCrop: state.selectedCrop,
        selectedRegion: state.selectedRegion,
        forecastPeriod: state.forecastPeriod,
      }),
    }
  )
);
