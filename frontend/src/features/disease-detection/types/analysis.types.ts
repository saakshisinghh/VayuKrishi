export interface AnalysisRequest {
  imageFile: File;
  cropType?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface AnalysisResponse {
  reportId: string;
  status: "processing" | "complete" | "failed";
  processingTime: number;
  disease: import("./disease.types").DetectedDisease;
  treatment: import("./treatment.types").TreatmentPlan;
  prevention: import("./treatment.types").PreventionPlan;
  outbreakRisk: import("./outbreak.types").OutbreakRisk[];
  weatherImpact: import("./outbreak.types").WeatherImpact;
  timeline: DiseaseTimeline;
}

export interface DiseaseTimeline {
  currentStage: TimelineStage;
  stages: TimelineStage[];
  criticalDates: CriticalDate[];
}

export interface TimelineStage {
  id: string;
  name: string;
  description: string;
  daysFromInfection: number;
  isCurrentStage: boolean;
  severity: import("./disease.types").DiseaseSeverity;
}

export interface CriticalDate {
  id: string;
  label: string;
  date: string;
  description: string;
  actionRequired: boolean;
}

export interface AnalysisStep {
  id: string;
  labelKey: string;
  duration: number;
}

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: "upload", labelKey: "analysis.steps.upload", duration: 800 },
  { id: "symptoms", labelKey: "analysis.steps.symptoms", duration: 1200 },
  { id: "patterns", labelKey: "analysis.steps.patterns", duration: 1500 },
  { id: "treatment", labelKey: "analysis.steps.treatment", duration: 1000 },
  { id: "confidence", labelKey: "analysis.steps.confidence", duration: 800 },
];
