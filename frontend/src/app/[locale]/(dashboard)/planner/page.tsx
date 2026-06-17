'use client';

import { Suspense, useState } from 'react';
import {
  useSeasonalPlan,
  useAIFarmPlan,
  useTaskProgress,
  usePlannerSummary,
  useUpdateTaskStatus,
} from '@/features/planner/hooks/use-planner';
import { PlannerHero } from '@/features/planner/components/planner-hero';
import { SeasonalTimeline } from '@/features/planner/components/seasonal-timeline';
import { MonthlyTaskCard } from '@/features/planner/components/monthly-task-card';
import { AIFarmPlanCard } from '@/features/planner/components/ai-farm-plan-card';
import { FarmCalendar } from '@/features/planner/components/farm-calendar';
import { TaskProgressCard } from '@/features/planner/components/task-progress-card';
import { TaskList } from '@/features/planner/components/task-list';
import { PlannerSkeleton } from '@/features/farm-health/components/loading-skeletons';
import { PlannerError } from '@/features/farm-health/components/error-states';
import type { MonthlyPlan, FarmTask } from '@/features/planner/types/planner.types';

function PlannerContent() {
  const { data: summary, isLoading: summaryLoading } = usePlannerSummary();
  const { data: seasonalPlan, isLoading, isError, refetch } = useSeasonalPlan();
  const { data: aiPlan } = useAIFarmPlan();
  const { data: taskProgress } = useTaskProgress();
  const updateTask = useUpdateTaskStatus();

  const currentMonthNum = new Date().getMonth() + 1;
  const [activeMonthPlan, setActiveMonthPlan] = useState<MonthlyPlan | null>(null);

  if (isLoading || summaryLoading) return <PlannerSkeleton />;
  if (isError || !seasonalPlan || !summary) return <PlannerError onRetry={refetch} />;

  const displayMonth =
    activeMonthPlan ??
    seasonalPlan.months.find((m) => m.month === currentMonthNum) ??
    seasonalPlan.months[0];

  // Aggregate all tasks for calendar + task list
  const allTasks: FarmTask[] = seasonalPlan.months.flatMap((m) => m.tasks);

  const handleToggleTask = (taskId: string, status: FarmTask['status']) => {
    updateTask.mutate({ taskId, status });
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <PlannerHero summary={summary} />

      {/* Seasonal timeline */}
      <SeasonalTimeline
        plan={seasonalPlan}
        onSelectMonth={setActiveMonthPlan}
      />

      {/* AI plan + Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {aiPlan && <AIFarmPlanCard plan={aiPlan} />}
        {taskProgress && <TaskProgressCard progress={taskProgress} />}
      </div>

      {/* Monthly tasks + Calendar */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {displayMonth && (
          <MonthlyTaskCard
            tasks={displayMonth.tasks}
            monthName={displayMonth.monthName}
            aiSuggestions={displayMonth.aiSuggestions}
            weatherAlert={displayMonth.weatherAlert}
            onToggleTask={handleToggleTask}
          />
        )}
        <FarmCalendar tasks={allTasks} />
      </div>

      {/* Full task list */}
      <TaskList tasks={allTasks} onToggleTask={handleToggleTask} />
    </div>
  );
}

export default function PlannerPage() {
  return (
    <main className="min-h-screen bg-[#080d08] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<PlannerSkeleton />}>
          <PlannerContent />
        </Suspense>
      </div>
    </main>
  );
}
