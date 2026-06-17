import type {
  SeasonalPlan,
  MonthlyPlan,
  FarmTask,
  AIFarmPlan,
  TaskProgress,
  PlannerSummary,
} from '../types/planner.types';

// ─── Mock Tasks ───────────────────────────────────────────────────────────────

const juneTask: FarmTask[] = [
  {
    id: 't1',
    title: 'Prepare land for Kharif sowing',
    description: 'Deep ploughing and bed preparation for main Kharif crop',
    category: 'soil_prep',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2024-06-10',
    crop: 'Soybean',
    estimatedHours: 8,
    aiGenerated: true,
  },
  {
    id: 't2',
    title: 'Apply basal fertilizer (DAP)',
    description: 'Apply 50 kg DAP per acre before sowing',
    category: 'fertilizer',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-06-12',
    crop: 'Soybean',
    estimatedHours: 3,
    aiGenerated: false,
  },
  {
    id: 't3',
    title: 'Sow Soybean (JS-335)',
    description: 'Main sowing activity — use 30 kg seed/acre',
    category: 'sowing',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2024-06-15',
    crop: 'Soybean',
    estimatedHours: 10,
    aiGenerated: true,
  },
  {
    id: 't4',
    title: 'Set up irrigation system check',
    description: 'Inspect and clean drip lines before monsoon',
    category: 'irrigation',
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-06-05',
    completedDate: '2024-06-04',
    estimatedHours: 4,
    aiGenerated: false,
  },
];

const julyTasks: FarmTask[] = [
  {
    id: 't5',
    title: 'First weeding',
    description: 'Manual or chemical weeding 20-25 days after sowing',
    category: 'monitoring',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-07-08',
    crop: 'Soybean',
    estimatedHours: 12,
    aiGenerated: true,
  },
  {
    id: 't6',
    title: 'Apply urea top dressing',
    description: '20 kg urea/acre at vegetative stage',
    category: 'fertilizer',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-07-15',
    crop: 'Soybean',
    estimatedHours: 3,
    aiGenerated: false,
  },
  {
    id: 't7',
    title: 'Scout for insect pest',
    description: 'Monitor for stem fly, girdle beetle',
    category: 'pest_control',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-07-20',
    crop: 'Soybean',
    estimatedHours: 2,
    aiGenerated: true,
  },
];

const monthlyPlans: MonthlyPlan[] = [
  {
    month: 6,
    monthName: 'June',
    season: 'kharif',
    tasks: juneTask,
    aiSuggestions: [
      'Monsoon onset expected June 12 — prepare sowing immediately',
      'Soil moisture optimal post-rain for germination',
    ],
    weatherAlert: 'Heavy rainfall expected June 10-15. Ensure drainage.',
    keyActivity: 'Land preparation & sowing',
  },
  {
    month: 7,
    monthName: 'July',
    season: 'kharif',
    tasks: julyTasks,
    aiSuggestions: [
      'Weed pressure high this season — early control is critical',
      'Apply micronutrients if yellowing observed',
    ],
    keyActivity: 'Weeding & crop protection',
  },
  {
    month: 8,
    monthName: 'August',
    season: 'kharif',
    tasks: [
      {
        id: 't8',
        title: 'Second fertilizer application',
        description: 'Potash application at flowering stage',
        category: 'fertilizer',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-08-05',
        crop: 'Soybean',
        estimatedHours: 3,
        aiGenerated: false,
      },
    ],
    aiSuggestions: ['Flowering stage — critical irrigation if dry spell', 'Monitor for leaf eating caterpillar'],
    keyActivity: 'Flowering management',
  },
  {
    month: 9,
    monthName: 'September',
    season: 'kharif',
    tasks: [],
    aiSuggestions: ['Pod filling stage — ensure no water stress', 'Reduce irrigation 2 weeks before harvest'],
    keyActivity: 'Pod filling & maturity',
  },
  {
    month: 10,
    monthName: 'October',
    season: 'kharif',
    tasks: [
      {
        id: 't9',
        title: 'Harvest Soybean',
        description: 'Harvest when 90% pods turn brown',
        category: 'harvesting',
        priority: 'urgent',
        status: 'pending',
        dueDate: '2024-10-15',
        crop: 'Soybean',
        estimatedHours: 20,
        aiGenerated: true,
      },
    ],
    aiSuggestions: ['Harvest promptly to avoid shattering loss', 'Dry grain to 12% moisture before storage'],
    keyActivity: 'Harvest & threshing',
  },
  {
    month: 11,
    monthName: 'November',
    season: 'rabi',
    tasks: [
      {
        id: 't10',
        title: 'Prepare for Rabi wheat',
        description: 'Post-harvest residue management and land prep',
        category: 'soil_prep',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-11-10',
        crop: 'Wheat',
        estimatedHours: 8,
        aiGenerated: true,
      },
    ],
    aiSuggestions: ['Good time to apply farmyard manure', 'Test soil after Kharif crop'],
    keyActivity: 'Rabi preparation',
  },
];

export const mockSeasonalPlan: SeasonalPlan = {
  season: 'kharif',
  year: 2024,
  startMonth: 6,
  endMonth: 11,
  primaryCrops: ['Soybean', 'Wheat (Rabi)'],
  months: monthlyPlans,
  expectedYield: 18,
  expectedRevenue: 120000,
  totalTasks: 10,
};

export const mockAIFarmPlan: AIFarmPlan = {
  id: 'plan-001',
  generatedAt: new Date().toISOString(),
  currentSeason: 'kharif',
  currentMonth: 'June 2024',
  recommendedActions: [
    {
      id: 'a1',
      action: 'Complete land preparation immediately',
      category: 'soil_prep',
      urgency: 'urgent',
      rationale: 'Monsoon onset predicted in 5 days',
      expectedBenefit: 'Optimal germination conditions',
      deadline: '2024-06-10',
    },
    {
      id: 'a2',
      action: 'Apply rhizobium seed treatment',
      category: 'sowing',
      urgency: 'high',
      rationale: 'Reduces nitrogen fertilizer need by 30%',
      expectedBenefit: 'Save ₹2,000/acre in fertilizer costs',
    },
    {
      id: 'a3',
      action: 'Install weather monitoring sensor',
      category: 'monitoring',
      urgency: 'medium',
      rationale: 'Enables precision irrigation decisions',
      expectedBenefit: '20% water savings over season',
    },
  ],
  expectedOutcome: 'Estimated yield: 18 qt/acre, Revenue: ₹1.2L',
  riskReduction: 35,
  profitImpact: 22000,
  confidence: 87,
};

export const mockTaskProgress: TaskProgress = {
  totalTasks: 10,
  completedTasks: 2,
  pendingTasks: 6,
  overdueTasks: 0,
  upcomingTasks: 2,
  completionPercent: 20,
  categoryBreakdown: [
    { category: 'soil_prep', total: 2, completed: 1, percent: 50 },
    { category: 'sowing', total: 2, completed: 0, percent: 0 },
    { category: 'fertilizer', total: 3, completed: 0, percent: 0 },
    { category: 'irrigation', total: 1, completed: 1, percent: 100 },
    { category: 'harvesting', total: 1, completed: 0, percent: 0 },
    { category: 'monitoring', total: 1, completed: 0, percent: 0 },
  ],
};

// ─── Service Functions ────────────────────────────────────────────────────────

export async function fetchSeasonalPlan(farmerId: string): Promise<SeasonalPlan> {
  await new Promise((r) => setTimeout(r, 700));
  return mockSeasonalPlan;
}

export async function fetchAIFarmPlan(farmerId: string): Promise<AIFarmPlan> {
  await new Promise((r) => setTimeout(r, 1000));
  return mockAIFarmPlan;
}

export async function fetchTaskProgress(farmerId: string): Promise<TaskProgress> {
  await new Promise((r) => setTimeout(r, 400));
  return mockTaskProgress;
}

export async function updateTaskStatus(
  taskId: string,
  status: FarmTask['status']
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 300));
  return { success: true };
}

export async function fetchPlannerSummary(farmerId: string): Promise<PlannerSummary> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    currentSeason: 'kharif',
    currentMonth: 'June 2024',
    upcomingTasksCount: 4,
    aiSuggestionsCount: 2,
    completionRate: 20,
    nextMajorActivity: 'Sow Soybean (JS-335) — due June 15',
  };
}
