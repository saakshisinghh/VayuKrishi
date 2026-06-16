'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  onRetry?: () => void;
  onReconnect?: () => void;
  message?: string;
}

const ErrorBase: React.FC<{
  icon: string;
  title: string;
  description: string;
  actions: React.ReactNode;
}> = ({ icon, title, description, actions }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-semibold text-zinc-200">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-xs leading-relaxed">{description}</p>
    </div>
    <div className="flex gap-2">{actions}</div>
  </div>
);

const RetryButton: React.FC<{ onClick?: () => void; label: string }> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2 transition-colors"
  >
    {label}
  </button>
);

const SecondaryButton: React.FC<{ onClick?: () => void; label: string }> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium px-4 py-2 transition-colors"
  >
    {label}
  </button>
);

export const AssistantError: React.FC<ErrorProps> = ({ onRetry, onReconnect }) => {
  const t = useTranslations('assistant');
  return (
    <ErrorBase
      icon="🌾"
      title={t('errors.assistantTitle')}
      description={t('errors.assistantDesc')}
      actions={
        <>
          {onRetry && <RetryButton onClick={onRetry} label={t('errors.retry')} />}
          {onReconnect && <SecondaryButton onClick={onReconnect} label={t('errors.reconnect')} />}
        </>
      }
    />
  );
};

export const VoiceError: React.FC<ErrorProps & { permissionDenied?: boolean }> = ({
  onRetry,
  permissionDenied,
}) => {
  const t = useTranslations('assistant');
  return (
    <ErrorBase
      icon="🎤"
      title={t('errors.voiceTitle')}
      description={permissionDenied ? t('errors.voicePermission') : t('errors.voiceDesc')}
      actions={
        <RetryButton onClick={onRetry} label={t('errors.retry')} />
      }
    />
  );
};

export const TranscriptionError: React.FC<ErrorProps> = ({ onRetry }) => {
  const t = useTranslations('assistant');
  return (
    <ErrorBase
      icon="📝"
      title={t('errors.transcriptionTitle')}
      description={t('errors.transcriptionDesc')}
      actions={
        <RetryButton onClick={onRetry} label={t('errors.retry')} />
      }
    />
  );
};

export const MemoryError: React.FC<ErrorProps> = ({ onRetry }) => {
  const t = useTranslations('assistant');
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-start gap-3">
      <span className="text-amber-400 text-lg mt-0.5">⚠️</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-400">{t('errors.memoryTitle')}</p>
        <p className="text-xs text-amber-400/70 mt-0.5">{t('errors.memoryDesc')}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-amber-400 hover:text-amber-300 underline flex-shrink-0"
        >
          {t('errors.retry')}
        </button>
      )}
    </div>
  );
};
