'use client';

import { useTranslations } from 'next-intl';
import { Bug, MapPin, Cloud, ShieldCheck } from 'lucide-react';
import type { DiseaseRisk } from '../types/farm-health.types';

interface DiseaseRiskCardProps {
  diseaseRisk: DiseaseRisk;
}

const riskStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Low' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Medium' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', label: 'High' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Critical' },
};

export function DiseaseRiskCard({ diseaseRisk }: DiseaseRiskCardProps) {
  const t = useTranslations('farmHealth');
  const riskStyle = riskStyles[diseaseRisk.currentRisk];

  const gaugeRotation = (diseaseRisk.riskScore / 100) * 180 - 90;

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6"
      role="region"
      aria-label={t('disease.title')}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10">
            <Bug className="h-5 w-5 text-orange-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{t('disease.title')}</h2>
            <p className="text-xs text-slate-500">{t('disease.subtitle')}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium border ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}>
          {riskStyle.label} Risk
        </span>
      </div>

      {/* Risk gauge */}
      <div className="mb-5 flex justify-center">
        <div className="relative h-24 w-48 overflow-hidden">
          {/* Half circle track */}
          <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" />
            <path
              d="M 10 100 A 90 90 0 0 1 190 100"
              fill="none"
              stroke={diseaseRisk.currentRisk === 'low' ? '#10b981' : diseaseRisk.currentRisk === 'medium' ? '#f59e0b' : '#ef4444'}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (diseaseRisk.riskScore / 100) * 282.7}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <span className={`block text-2xl font-black ${riskStyle.text}`}>{diseaseRisk.riskScore}</span>
            <span className="text-xs text-slate-500">Risk Score</span>
          </div>
        </div>
      </div>

      {/* Nearby outbreaks */}
      {diseaseRisk.nearbyOutbreaks.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <p className="text-xs font-semibold text-slate-400">{t('disease.nearbyOutbreaks')}</p>
          </div>
          <div className="space-y-2">
            {diseaseRisk.nearbyOutbreaks.map((outbreak, i) => {
              const style = riskStyles[outbreak.severity];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-medium text-white">{outbreak.disease}</p>
                    <p className="text-xs text-slate-500">{outbreak.affectedCrop}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${style.text}`}>{outbreak.severity}</span>
                    <p className="text-xs text-slate-600">{outbreak.distanceKm} km away</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weather impact */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-800/40 px-3 py-2">
        <Cloud className="h-4 w-4 text-blue-400" aria-hidden="true" />
        <p className="text-xs text-slate-400">
          {t('disease.weatherImpact')}:{' '}
          <span className={`font-medium ${diseaseRisk.weatherImpact === 'low' ? 'text-emerald-400' : diseaseRisk.weatherImpact === 'moderate' ? 'text-amber-400' : 'text-red-400'}`}>
            {diseaseRisk.weatherImpact}
          </span>
        </p>
      </div>

      {/* Prevention actions */}
      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <p className="text-xs font-semibold text-emerald-400">{t('disease.preventionActions')}</p>
        </div>
        <ul className="space-y-1.5">
          {diseaseRisk.preventionActions.map((action, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
              <span className="mt-0.5 text-emerald-500">•</span>
              {action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
