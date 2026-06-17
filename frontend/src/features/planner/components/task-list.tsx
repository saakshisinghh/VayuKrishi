'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, SortAsc } from 'lucide-react';
import type { FarmTask, TaskCategory, TaskStatus } from '../types/planner.types';

interface TaskListProps {
  tasks: FarmTask[];
  onToggleTask?: (taskId: string, status: FarmTask['status']) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
  skipped: 'Skipped',
};

const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-slate-700 text-slate-300',
  in_progress: 'bg-amber-500/20 text-amber-300',
  completed: 'bg-emerald-500/20 text-emerald-300',
  overdue: 'bg-red-500/20 text-red-300',
  skipped: 'bg-slate-600/20 text-slate-500',
};

const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

type SortKey = 'priority' | 'dueDate' | 'category';
type FilterStatus = 'all' | TaskStatus;

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
  const t = useTranslations('planner');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortKey>('priority');

  const filtered = tasks
    .filter((task) => filterStatus === 'all' || task.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'dueDate') return (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
      return a.category.localeCompare(b.category);
    });

  const filterOptions: FilterStatus[] = ['all', 'pending', 'in_progress', 'completed', 'overdue'];

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('taskList.title')}
    >
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">{t('taskList.title')}</h2>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <SortAsc className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Sort tasks by"
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Status filters */}
      <div
        className="mb-4 flex gap-1.5 overflow-x-auto pb-1"
        role="group"
        aria-label="Filter tasks by status"
      >
        {filterOptions.map((status) => {
          const count = status === 'all' ? tasks.length : tasks.filter((t) => t.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                filterStatus === status
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              aria-pressed={filterStatus === status}
            >
              {status === 'all' ? 'All' : statusLabels[status as TaskStatus]} ({count})
            </button>
          );
        })}
      </div>

      {/* Task items */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Filter className="mb-2 h-8 w-8 text-slate-700" aria-hidden="true" />
          <p className="text-sm text-slate-600">No tasks match this filter</p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Task items">
          {filtered.map((task) => {
            const isDone = task.status === 'completed';
            const isOverdue = task.status === 'overdue';

            return (
              <li
                key={task.id}
                className={`flex items-start gap-3 rounded-xl p-3 transition ${
                  isDone ? 'opacity-50 bg-slate-800/20' : isOverdue ? 'bg-red-500/5 border border-red-500/20' : 'bg-slate-800/30 hover:bg-slate-800/60'
                }`}
              >
                <button
                  onClick={() => onToggleTask?.(task.id, isDone ? 'pending' : 'completed')}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-2 border-slate-600 transition hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={isDone ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
                  aria-label={isDone ? `Unmark "${task.title}"` : `Mark "${task.title}" complete`}
                >
                  {isDone && (
                    <svg viewBox="0 0 16 16" className="h-full w-full" fill="none">
                      <path d="M3 8l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[task.status]}`}>
                      {statusLabels[task.status]}
                    </span>
                    <span className="text-xs capitalize text-slate-500">{task.category.replace('_', ' ')}</span>
                    {task.dueDate && (
                      <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-slate-600'}`}>
                        {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                    {task.aiGenerated && (
                      <span className="rounded-full bg-teal-500/10 px-1.5 py-0.5 text-xs text-teal-400">AI</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
