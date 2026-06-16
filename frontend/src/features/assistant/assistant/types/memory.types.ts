export interface FarmerProfile {
  id: string;
  name: string;
  nameLocal?: string;
  location: {
    village: string;
    district: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  farmSize: number;
  farmSizeUnit: 'acres' | 'hectares' | 'bigha';
  soilType: string;
  soilTypeLocal?: string;
  preferredLanguage: string;
  phone?: string;
  experience: number;
}

export interface CropHistoryEntry {
  id: string;
  crop: string;
  cropLocal: string;
  season: 'kharif' | 'rabi' | 'zaid';
  year: number;
  yield: number;
  yieldUnit: string;
  area: number;
  success: boolean;
  notes?: string;
}

export interface DiseaseHistoryEntry {
  id: string;
  disease: string;
  diseaseLocal: string;
  crop: string;
  detectedAt: Date;
  severity: 'mild' | 'moderate' | 'severe';
  treated: boolean;
  treatmentUsed?: string;
  outcome: 'resolved' | 'ongoing' | 'crop_loss';
}

export interface RecommendationHistoryEntry {
  id: string;
  recommendedCrop: string;
  recommendedAt: Date;
  accepted: boolean;
  outcome?: string;
}

export interface FarmerMemory {
  profile: FarmerProfile;
  currentCrop?: string;
  currentCropLocal?: string;
  cropHistory: CropHistoryEntry[];
  diseaseHistory: DiseaseHistoryEntry[];
  recommendationHistory: RecommendationHistoryEntry[];
  lastInteraction?: Date;
  totalSessions: number;
  insights: MemoryInsight[];
}

export interface MemoryInsight {
  id: string;
  type: 'last_crop' | 'previous_disease' | 'last_recommendation' | 'pattern' | 'alert';
  labelKey: string;
  value: string;
  valueLocal?: string;
  date?: Date;
  icon: string;
  color: string;
}
