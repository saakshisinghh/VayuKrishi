import { create } from "zustand";

interface DashboardUIState {
  expandedRecommendation: string | null;
  selectedMarketCrop: string | null;
  isVoiceWidgetOpen: boolean;
  activeAlertId: string | null;

  setExpandedRecommendation: (id: string | null) => void;
  setSelectedMarketCrop: (cropId: string | null) => void;
  setVoiceWidgetOpen: (open: boolean) => void;
  setActiveAlertId: (id: string | null) => void;
}

export const useDashboardUIStore = create<DashboardUIState>((set) => ({
  expandedRecommendation: null,
  selectedMarketCrop: "soybean",
  isVoiceWidgetOpen: false,
  activeAlertId: null,

  setExpandedRecommendation: (id) => set({ expandedRecommendation: id }),
  setSelectedMarketCrop: (cropId) => set({ selectedMarketCrop: cropId }),
  setVoiceWidgetOpen: (open) => set({ isVoiceWidgetOpen: open }),
  setActiveAlertId: (id) => set({ activeAlertId: id }),
}));
