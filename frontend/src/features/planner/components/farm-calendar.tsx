'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FarmTask } from '../types/planner.types';

interface FarmCalendarProps {
  tasks: FarmTask[];
  onSelectDate?: (date: string, tasks: FarmTask[]) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const taskCategoryDots: Record<string, string> = {
  sowing: 'bg-emerald-400',
  fertilizer: 'bg-amber-400',
  irrigation: 'bg-blue-400',
  monitoring: 'bg-violet-400',
  harvesting: 'bg-orange-400',
  pest_control: 'bg-red-400',
  soil_prep: 'bg-stone-400',
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function FarmCalendar({ tasks, onSelectDate }: FarmCalendarProps) {
  const t = useTranslations('planner');
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a map: dateString → tasks[]
  const taskMap = useMemo(() => {
    const map: Record<string, FarmTask[]> = {};
    tasks.forEach((task) => {
      if (task.dueDate) {
        const key = task.dueDate.slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    });
    return map;
  }, [tasks]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    onSelectDate?.(dateStr, taskMap[dateStr] ?? []);
  };

  const selectedTasks = selectedDate ? (taskMap[selectedDate] ?? []) : [];

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('calendar.title')}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">{t('calendar.title')}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-32 text-center text-sm font-semibold text-white">{monthLabel}</span>
          <button
            onClick={nextMonth}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-slate-600">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label={`Calendar for ${monthLabel}`}>
        {Array.from({ length: totalCells }).map((_, idx) => {
          const dayNum = idx - firstDay + 1;
          const isValid = dayNum >= 1 && dayNum <= daysInMonth;
          const dateStr = isValid
            ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
            : null;
          const isToday =
            isValid &&
            dayNum === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear === today.getFullYear();
          const isSelected = dateStr === selectedDate;
          const dayTasks = dateStr ? (taskMap[dateStr] ?? []) : [];

          return (
            <div
              key={idx}
              role={isValid ? 'gridcell' : 'presentation'}
              aria-label={isValid ? `${dayNum} ${monthLabel}${dayTasks.length > 0 ? `, ${dayTasks.length} tasks` : ''}` : undefined}
            >
              {isValid ? (
                <button
                  onClick={() => handleDayClick(dateStr!)}
                  className={`relative flex h-9 w-full flex-col items-center justify-start rounded-lg pt-1 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isSelected
                      ? 'bg-teal-500 text-white'
                      : isToday
                      ? 'bg-teal-500/20 text-teal-400 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`font-medium ${isToday && !isSelected ? 'text-teal-300' : ''}`}>{dayNum}</span>
                  {/* Task dots */}
                  {dayTasks.length > 0 && (
                    <div className="mt-0.5 flex gap-0.5">
                      {dayTasks.slice(0, 3).map((task, i) => (
                        <span
                          key={i}
                          className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : taskCategoryDots[task.category] ?? 'bg-slate-400'}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  )}
                </button>
              ) : (
                <div className="h-9 w-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected day tasks */}
      {selectedDate && (
        <div className="mt-4 border-t border-slate-800 pt-4">
          <p className="mb-2 text-xs font-semibold text-slate-400">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {selectedTasks.length === 0 ? (
            <p className="text-xs text-slate-600">No tasks scheduled</p>
          ) : (
            <ul className="space-y-1.5">
              {selectedTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-2">
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${taskCategoryDots[task.category]}`} aria-hidden="true" />
                  <span className="text-xs text-slate-300">{task.title}</span>
                  <span className={`ml-auto text-xs ${task.priority === 'urgent' ? 'text-red-400' : 'text-slate-600'}`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
        {Object.entries(taskCategoryDots).slice(0, 5).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1 text-xs text-slate-600 capitalize">
            <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
            {cat.replace('_', ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}
