export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskCategory = 'sowing' | 'fertilizer' | 'irrigation' | 'monitoring' | 'harvesting' | 'pest_control' | 'soil_prep';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'skipped';
export type Season = 'kharif' | 'rabi' | 'zaid' | 'summer';

export interface FarmTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  completedDate?: string;
  crop?: string;
  estimatedHours: number;
  notes?: string;
  aiGenerated: boolean;
}

export interface MonthlyPlan {
  month: number;
  monthName: string;
  season: Season;
  tasks: FarmTask[];
  aiSuggestions: string[];
  weatherAlert?: string;
  keyActivity: string;
}

export interface SeasonalPlan {
  season: Season;
  year: number;
  startMonth: number;
  endMonth: number;
  primaryCrops: string[];
  months: MonthlyPlan[];
  expectedYield: number;
  expectedRevenue: number;
  totalTasks: number;
}

export interface AIFarmPlan {
  id: string;
  generatedAt: string;
  currentSeason: Season;
  currentMonth: string;
  recommendedActions: AIAction[];
  expectedOutcome: string;
  riskReduction: number;
  profitImpact: number;
  confidence: number;
}

export interface AIAction {
  id: string;
  action: string;
  category: TaskCategory;
  urgency: TaskPriority;
  rationale: string;
  expectedBenefit: string;
  deadline?: string;
}

export interface TaskProgress {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  completionPercent: number;
  categoryBreakdown: CategoryProgress[];
}

export interface CategoryProgress {
  category: TaskCategory;
  total: number;
  completed: number;
  percent: number;
}

export interface CalendarDay {
  date: string;
  tasks: FarmTask[];
  hasUrgentTask: boolean;
  isToday: boolean;
}

export interface PlannerSummary {
  currentSeason: Season;
  currentMonth: string;
  upcomingTasksCount: number;
  aiSuggestionsCount: number;
  completionRate: number;
  nextMajorActivity: string;
}
