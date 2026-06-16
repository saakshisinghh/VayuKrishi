export interface TreatmentPlan {
  id: string;
  urgency: "immediate" | "within_24h" | "within_week" | "monitor";
  medicines: Medicine[];
  organicAlternatives: Medicine[];
  applicationSchedule: ApplicationSchedule[];
  safetyNotes: string[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  effectiveness: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  dilution?: string;
  applicationMethod: ApplicationMethod;
  frequency: string;
  duration: string;
  safetyInterval: string;
  isOrganic: boolean;
  availableAt: string[];
}

export type ApplicationMethod =
  | "spray"
  | "drench"
  | "dust"
  | "injection"
  | "soil_application";

export interface ApplicationSchedule {
  id: string;
  day: number;
  task: string;
  medicine?: string;
  notes: string;
}

export interface PreventionPlan {
  id: string;
  actions: PreventionAction[];
  monitoringChecklist: ChecklistItem[];
  futureRiskReduction: RiskReductionStrategy[];
  nextInspectionDate: string;
}

export interface PreventionAction {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  frequency: string;
  icon: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  frequency: "daily" | "weekly" | "monthly";
  completed: boolean;
}

export interface RiskReductionStrategy {
  id: string;
  strategy: string;
  expectedReduction: number;
  timeframe: string;
}
