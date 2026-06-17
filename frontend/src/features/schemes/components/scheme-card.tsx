'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  IndianRupee,
} from 'lucide-react';
import type { GovernmentScheme, EligibilityScore } from '../types/scheme.types';

interface SchemeCardProps {
  scheme: GovernmentScheme;
  eligibility?: EligibilityScore;
  onApply?: (schemeId: string) => void;
}

const categoryColors: Record<string, string> = {
  subsidy: 'bg-emerald-500/10 text-emerald-400',
  insurance: 'bg-blue-500/10 text-blue-400',
  loan: 'bg-violet-500/10 text-violet-400',
  training: 'bg-amber-500/10 text-amber-400',
  equipment: 'bg-orange-500/10 text-orange-400',
  seed: 'bg-teal-500/10 text-teal-400',
};

export function SchemeCard({ scheme, eligibility, onApply }: SchemeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations('schemes');

  const catStyle = categoryColors[scheme.category] ?? 'bg-slate-500/10 text-slate-400';

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] overflow-hidden transition-all"
      role="article"
      aria-label={scheme.name}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-white">{scheme.name}</h3>
              {scheme.nameLocal && (
                <span className="text-xs text-slate-500">({scheme.nameLocal})</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="h-3 w-3" aria-hidden="true" />
              {scheme.ministry}
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${catStyle}`}>
            {scheme.category}
          </span>
        </div>

        <p className="mb-4 text-sm text-slate-400 leading-relaxed">{scheme.description}</p>

        {/* Benefit highlight */}
        {scheme.maxBenefitAmount && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 px-3 py-2.5">
            <IndianRupee className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <div>
              <p className="text-xs text-slate-500">Max Benefit</p>
              <p className="text-base font-bold text-emerald-400">
                ₹{scheme.maxBenefitAmount.toLocaleString('en-IN')}
              </p>
            </div>
            {eligibility && (
              <div className="ml-auto text-right">
                <p className="text-xs text-slate-500">Your eligibility</p>
                <p className="text-base font-bold text-white">{eligibility.eligibilityPercent}%</p>
              </div>
            )}
          </div>
        )}

        {/* Deadline */}
        {scheme.deadline && (
          <div className="mb-4 flex items-center gap-1.5 text-xs text-amber-400">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Deadline: {new Date(scheme.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800"
          aria-expanded={expanded}
          aria-controls={`scheme-details-${scheme.id}`}
        >
          <span>{expanded ? 'Hide details' : 'View details & apply'}</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div id={`scheme-details-${scheme.id}`} className="border-t border-slate-800 p-5 space-y-5">
          {/* Eligibility criteria */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Eligibility Criteria</h4>
            <ul className="space-y-2">
              {scheme.eligibilityCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  {c.met ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" aria-label="Met" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" aria-label="Not met" />
                  )}
                  <span className={`text-xs ${c.met ? 'text-slate-300' : 'text-slate-500'}`}>
                    {c.criterion}
                    {!c.required && <span className="ml-1 text-slate-600">(optional)</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents required */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Documents Required</h4>
            <div className="flex flex-wrap gap-2">
              {scheme.documentsRequired.map((doc, i) => (
                <span key={i} className="flex items-center gap-1.5 rounded-lg bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300">
                  <FileText className="h-3 w-3 text-slate-500" aria-hidden="true" />
                  {doc}
                </span>
              ))}
            </div>
          </div>

          {/* Application process */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Application Process</h4>
            <ol className="space-y-2">
              {scheme.applicationProcess.map((step) => (
                <li key={step.stepNumber} className="flex gap-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                    {step.stepNumber}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{step.title}</p>
                    <p className="text-xs text-slate-500">{step.description} · {step.estimatedTime}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {onApply && (
              <button
                onClick={() => onApply(scheme.id)}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Apply Now
              </button>
            )}
            {scheme.applicationUrl && (
              <a
                href={scheme.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-500"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Official Site
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
