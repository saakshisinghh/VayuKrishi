export interface FarmHealthData {
  overallScore: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: HealthCategory[];
  trend: number; // change from last assessment
  lastAssessed: string;
  nextAssessmentDue: string;
  recommendations: string[];
}

export interface HealthCategory {
  id: string;
  label: string;
  score: number;
  weight: number;
  status: "excellent" | "good" | "fair" | "poor";
  trend: "improving" | "stable" | "declining";
  detail: string;
}
