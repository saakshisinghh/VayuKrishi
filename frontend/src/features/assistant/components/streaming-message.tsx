'use client';

import React, { useEffect, useRef } from 'react';
import { useAssistantStore } from '../store/assistant-store';
import { useTranslations } from 'next-intl';

interface StreamingMessageProps {
  messageId: string;
  content: string;
  onCancel?: () => void;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  messageId,
  content,
  onCancel,
}) => {
  const t = useTranslations('assistant');
  const { cancelStreaming } = useAssistantStore();
  const cursorRef = useRef<HTMLSpanElement>(null);

  const handleCancel = () => {
    cancelStreaming();
    onCancel?.();
  };

  return (
    <div className="group relative">
      <div className="prose prose-invert prose-sm max-w-none">
        <span className="whitespace-pre-wrap break-words leading-relaxed text-zinc-100">
          {content}
        </span>
        <span
          ref={cursorRef}
          className="inline-block w-0.5 h-4 bg-emerald-400 ml-0.5 align-middle animate-pulse"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <svg className="animate-spin w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          {t('streaming.generating')}
        </div>
        <button
          onClick={handleCancel}
          className="text-xs text-zinc-500 hover:text-red-400 transition-colors underline"
          aria-label={t('streaming.cancel')}
        >
          {t('streaming.cancel')}
        </button>
      </div>
    </div>
  );
};

export default StreamingMessage;
