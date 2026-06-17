'use client';

import { useTranslations } from 'next-intl';
import { ClipboardList, CheckCircle2, Clock, AlertCircle, XCircle, FileText } from 'lucide-react';
import type { SchemeApplication } from '../types/scheme.types';

interface ApplicationTrackerProps {
  applications: SchemeApplication[];
}

const statusConfig = {
  not_started: {
    icon: <ClipboardList className="h-4 w-4" />,
    label: 'Not Started',
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    border: 'border-slate-500/20',
    step: 0,
  },
  in_progress: {
    icon: <Clock className="h-4 w-4" />,
    label: 'In Progress',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-500/20',
    step: 1,
  },
  submitted: {
    icon: <FileText className="h-4 w-4" />,
    label: 'Submitted',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-500/20',
    step: 2,
  },
  approved: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Approved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-500/20',
    step: 3,
  },
  rejected: {
    icon: <XCircle className="h-4 w-4" />,
    label: 'Rejected',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-500/20',
    step: -1,
  },
};

const PIPELINE = ['not_started', 'in_progress', 'submitted', 'approved'] as const;

export function ApplicationTracker({ applications }: ApplicationTrackerProps) {
  const t = useTranslations('schemes');

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('tracker.title')}
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
          <ClipboardList className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{t('tracker.title')}</h2>
          <p className="text-xs text-slate-500">{applications.length} applications tracked</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-800/30 py-10 text-center">
          <AlertCircle className="mb-2 h-8 w-8 text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-500">{t('tracker.noApplications')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const cfg = statusConfig[app.status];
            const currentStep = cfg.step;

            return (
              <div
                key={app.id}
                className={`rounded-xl border ${cfg.border} bg-slate-900/50 p-4`}
                role="article"
                aria-label={`${app.schemeName} application — ${cfg.label}`}
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{app.schemeName}</h3>
                    {app.referenceNumber && (
                      <p className="text-xs text-slate-500">Ref: {app.referenceNumber}</p>
                    )}
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon}
                    {cfg.label}
                  </span>
                </div>

                {/* Progress pipeline (not for rejected) */}
                {app.status !== 'rejected' && (
                  <div className="mb-3 flex items-center gap-1">
                    {PIPELINE.map((step, i) => {
                      const stepCfg = statusConfig[step];
                      const isDone = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={step} className="flex flex-1 items-center">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all ${
                              isDone
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-800 text-slate-600'
                            } ${isCurrent ? 'ring-2 ring-violet-400 ring-offset-1 ring-offset-slate-900' : ''}`}
                            aria-label={`Step ${i + 1}: ${stepCfg.label} ${isDone ? '(completed)' : ''}`}
                          >
                            {i + 1}
                          </div>
                          {i < PIPELINE.length - 1 && (
                            <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-violet-600' : 'bg-slate-800'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Documents */}
                {app.pendingDocuments.length > 0 && (
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5">
                    <p className="mb-1 text-xs font-medium text-amber-400">Pending documents:</p>
                    <p className="text-xs text-slate-400">{app.pendingDocuments.join(', ')}</p>
                  </div>
                )}

                <p className="mt-2 text-xs text-slate-600">
                  Updated: {new Date(app.lastUpdated).toLocaleDateString('en-IN')}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
