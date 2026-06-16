export type DiseaseSeverity = "low" | "moderate" | "high" | "critical";

export type DiseaseStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

export interface DiseaseReport {
  id: string;
  userId: string;
  imageUrl: string;
  thumbnailUrl: string;
  cropType: string;
  detectedAt: string;
  disease: DetectedDisease;
  treatment: TreatmentPlan;
  prevention: PreventionPlan;
  outbreakRisk: OutbreakRisk[];
  weatherImpact: WeatherImpact;
  timeline: DiseaseTimeline;
  savedToHistory: boolean;
}

export interface DetectedDisease {
  id: string;
  name: string;
  scientificName: string;
  severity: DiseaseSeverity;
  confidenceScore: number;
  symptoms: Symptom[];
  causes: Cause[];
  description: string;
  affectedParts: string[];
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
  detected: boolean;
}

export interface Cause {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DiseaseHistoryItem {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  diseaseName: string;
  cropType: string;
  severity: DiseaseSeverity;
  confidenceScore: number;
  detectedAt: string;
  treated: boolean;
}
