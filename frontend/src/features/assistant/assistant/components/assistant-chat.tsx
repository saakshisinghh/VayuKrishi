'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MessageRenderer } from './message-renderer';
import { VoiceRecorder } from './voice-recorder';
import { AudioUploader } from './audio-uploader';
import { QuickActionPanel } from './quick-action-panel';
import { useAssistantStore } from '../store/assistant-store';
import { AssistantLanguage } from '../types/assistant.types';

interface AssistantChatProps {
  language: AssistantLanguage;
  onSend: (content: string, language: AssistantLanguage) => void;
  showAudio?: boolean;
}

type InputMode = 'text' | 'voice' | 'upload';

export const AssistantChat: React.FC<AssistantChatProps> = ({
  language,
  onSend,
  showAudio = false,
}) => {
  const t = useTranslations('assistant');
  const { messages, isStreaming, inputText, setInputText } = useAssistantStore();
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(
    (content?: string) => {
      const text = (content ?? inputText).trim();
      if (!text || isStreaming) return;
      setInputText('');
      setShowQuickActions(false);
      onSend(text, language);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    },
    [inputText, isStreaming, language, onSend, setInputText]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const handleTranscript = (text: string) => {
    if (text.trim()) {
      setInputText(text);
      setInputMode('text');
      setTimeout(() => handleSend(text), 100);
    } else {
      setInputMode('text');
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <MessageRenderer
          messages={messages}
          locale={language}
          isStreaming={isStreaming}
          showAudio={showAudio}
        />
      </div>

      {/* Quick actions - only show on empty conversation */}
      {messages.length === 0 && showQuickActions && (
        <QuickActionPanel onAction={(p) => handleSend(p)} disabled={isStreaming} />
      )}

      {/* Input area */}
      <div className="border-t border-zinc-800 p-3">
        {/* Mode switcher */}
        <div className="flex items-center gap-1 mb-3">
          {(['text', 'voice', 'upload'] as InputMode[]).map((mode) => {
            const icons = { text: '⌨️', voice: '🎤', upload: '📁' };
            const labels = { text: t('input.text'), voice: t('input.voice'), upload: t('input.upload') };
            return (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                aria-pressed={inputMode === mode}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  inputMode === mode
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>{icons[mode]}</span>
                <span>{labels[mode]}</span>
              </button>
            );
          })}
          <div className="flex-1" />
          {messages.length > 0 && (
            <button
              onClick={() => setShowQuickActions((v) => !v)}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {showQuickActions ? t('input.hideActions') : t('input.showActions')}
            </button>
          )}
        </div>

        {/* Quick actions toggle in conversation */}
        {messages.length > 0 && showQuickActions && (
          <div className="mb-3 -mx-3">
            <QuickActionPanel onAction={(p) => handleSend(p)} disabled={isStreaming} />
          </div>
        )}

        {/* Text input */}
        {inputMode === 'text' && (
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={t('input.placeholder')}
                rows={1}
                disabled={isStreaming}
                aria-label={t('input.placeholder')}
                className="w-full resize-none rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50 transition-colors"
                style={{ minHeight: '48px', maxHeight: '160px' }}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isStreaming}
              aria-label={t('input.send')}
              className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white transition-all duration-200 flex items-center justify-center shadow-lg shadow-emerald-500/20 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {isStreaming ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Voice input */}
        {inputMode === 'voice' && (
          <VoiceRecorder
            language={language}
            onTranscript={handleTranscript}
          />
        )}

        {/* Audio upload */}
        {inputMode === 'upload' && (
          <AudioUploader language={language} onTranscript={handleTranscript} />
        )}

        <p className="text-xs text-zinc-700 text-center mt-2">{t('input.hint')}</p>
      </div>
    </div>
  );
};

export default AssistantChat;
