// ─── Farm Plan Types ──────────────────────────────────────────────────────────

export type TaskCategory = 'activity' | 'fertilizer' | 'irrigation' | 'monitoring';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface FarmTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  durationDays?: number;
  cost?: number;
}

export interface MonthlyPlan {
  month: number;               // 1–12
  monthName: string;
  cropStage: string;           // e.g. "Germination", "Vegetative", "Flowering"
  activities: FarmTask[];
  fertilizerTasks: FarmTask[];
  irrigationTasks: FarmTask[];
  monitoringTasks: FarmTask[];
  estimatedCost: number;
  weatherNote?: string;
}

export interface FarmPlanRequest {
  cropId: string;
  farmProfile: {
    landSize: number;
    landUnit: string;
    soilType: string;
    irrigationSource: string;
    season: string;
  };
}

export interface FarmPlanResponse {
  cropId: string;
  cropName: string;
  season: string;
  startMonth: number;
  durationMonths: number;
  totalEstimatedCost: number;
  monthlyPlans: MonthlyPlan[];
  generatedAt: string;
}
