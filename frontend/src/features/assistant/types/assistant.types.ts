export type AssistantLanguage = 'en' | 'mr' | 'hi' | 'gu' | 'ta' | 'kn';

export type AssistantStatus = 'online' | 'offline' | 'thinking' | 'speaking';

export interface AssistantContext {
  usedFarmLocation: boolean;
  usedSoilType: boolean;
  usedPreviousCrop: boolean;
  usedDiseaseHistory: boolean;
  usedWeatherData: boolean;
  usedMarketData: boolean;
}

export interface QuickAction {
  id: string;
  labelKey: string;
  icon: string;
  prompt: string;
  color: string;
}

export interface AssistantConfig {
  language: AssistantLanguage;
  voiceEnabled: boolean;
  autoSpeak: boolean;
  streamingEnabled: boolean;
  memoryEnabled: boolean;
}
