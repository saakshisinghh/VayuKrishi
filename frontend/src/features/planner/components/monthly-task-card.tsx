'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle, Clock, AlertCircle, Sprout, Droplets, Bug, Eye, Wheat, Shovel } from 'lucide-react';
import type { FarmTask, TaskCategory, TaskPriority } from '../types/planner.types';

interface MonthlyTaskCardProps {
  tasks: FarmTask[];
  monthName: string;
  aiSuggestions?: string[];
  weatherAlert?: string;
  onToggleTask?: (taskId: string, status: FarmTask['status']) => void;
}

const categoryConfig: Record<TaskCategory, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  sowing: { icon: <Sprout className="h-3.5 w-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Sowing' },
  fertilizer: { icon: <Sprout className="h-3.5 w-3.5" />, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Fertilizer' },
  irrigation: { icon: <Droplets className="h-3.5 w-3.5" />, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Irrigation' },
  monitoring: { icon: <Eye className="h-3.5 w-3.5" />, color: 'text-violet-400', bg: 'bg-violet-400/10', label: 'Monitoring' },
  harvesting: { icon: <Wheat className="h-3.5 w-3.5" />, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Harvesting' },
  pest_control: { icon: <Bug className="h-3.5 w-3.5" />, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Pest Control' },
  soil_prep: { icon: <Shovel className="h-3.5 w-3.5" />, color: 'text-stone-400', bg: 'bg-stone-400/10', label: 'Soil Prep' },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-400' },
  high: { label: 'High', color: 'text-orange-400' },
  medium: { label: 'Medium', color: 'text-amber-400' },
  low: { label: 'Low', color: 'text-slate-400' },
};

function TaskItem({ task, onToggle }: { task: FarmTask; onToggle?: (id: string, status: FarmTask['status']) => void }) {
  const cat = categoryConfig[task.category];
  const pri = priorityConfig[task.priority];
  const isDone = task.status === 'completed';
  const isOverdue = task.status === 'overdue';

  return (
    <div
      className={`flex items-start gap-3 rounded-xl p-3 transition-all ${isDone ? 'opacity-60 bg-slate-800/20' : 'bg-slate-900/50 hover:bg-slate-800/60'} ${isOverdue ? 'border border-red-500/20' : ''}`}
      role="listitem"
    >
      <button
        onClick={() => onToggle?.(task.id, isDone ? 'pending' : 'completed')}
        className="mt-0.5 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
        aria-label={isDone ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as complete`}
      >
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        ) : (
          <Circle className={`h-5 w-5 ${isOverdue ? 'text-red-400' : 'text-slate-600'}`} aria-hidden="true" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className={`text-sm font-medium ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
            {task.title}
          </p>
          {task.aiGenerated && (
            <span className="rounded-full bg-teal-500/10 px-1.5 py-0.5 text-xs text-teal-400">AI</span>
          )}
        </div>
        <p className="mb-2 text-xs text-slate-500">{task.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${cat.bg} ${cat.color}`}>
            {cat.icon}
            {cat.label}
          </span>
          <span className={`text-xs font-medium ${pri.color}`}>{pri.label}</span>
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {task.estimatedHours}h
          </span>
          {task.dueDate && (
            <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-slate-600'}`}>
              Due {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function MonthlyTaskCard({ tasks, monthName, aiSuggestions, weatherAlert, onToggleTask }: MonthlyTaskCardProps) {
  const t = useTranslations('planner');
  const [showAll, setShowAll] = useState(false);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 4);
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={`Tasks for ${monthName}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">{monthName} Tasks</h2>
          <p className="text-xs text-slate-500">
            {completedCount}/{tasks.length} {t('tasks.completed')}
          </p>
        </div>
        {/* Progress */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{
          background: `conic-gradient(#10b981 ${(completedCount / Math.max(tasks.length, 1)) * 360}deg, #1f2937 0deg)`
        }}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d1117]">
            <span className="text-xs font-bold text-white">{Math.round((completedCount / Math.max(tasks.length, 1)) * 100)}</span>
          </div>
        </div>
      </div>

      {/* Weather alert */}
      {weatherAlert && (
        <div className="mb-3 flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-400 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-300">{weatherAlert}</p>
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-600">{t('tasks.noTasks')}</p>
      ) : (
        <div className="space-y-2" role="list" aria-label={`${monthName} task list`}>
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
          ))}
        </div>
      )}

      {/* Show more/less */}
      {tasks.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full rounded-lg bg-slate-800/40 py-2 text-xs text-slate-400 transition hover:bg-slate-800"
        >
          {showAll ? `Show less` : `Show ${tasks.length - 4} more tasks`}
        </button>
      )}

      {/* AI suggestions */}
      {aiSuggestions && aiSuggestions.length > 0 && (
        <div className="mt-4 rounded-xl bg-teal-500/5 border border-teal-500/10 p-3">
          <p className="mb-2 text-xs font-semibold text-teal-400">🤖 AI Suggestions</p>
          <ul className="space-y-1.5">
            {aiSuggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                <span className="text-teal-500">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
