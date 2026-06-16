'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useAssistantStore } from '../store/assistant-store';
import { useAssistant } from '../queries/assistant.queries';
import { MessageRenderer } from './message-renderer';
import { VoiceWaveform } from './voice-waveform';
import { useVoiceStore } from '../store/voice-store';

export const AssistantWidget: React.FC<{ locale: string }> = ({ locale }) => {
  const t = useTranslations('assistant');
  const router = useRouter();
  const pathname = usePathname();
  const {
    isDrawerOpen,
    setDrawerOpen,
    messages,
    isStreaming,
    status,
    selectedLanguage,
    inputText,
    setInputText,
  } = useAssistantStore();
  const { sendMessage } = useAssistant();
  const { waveformData, recordingState } = useVoiceStore();
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || isStreaming) return;
    setInputText('');
    sendMessage(text, selectedLanguage);
  }, [inputText, isStreaming, selectedLanguage, sendMessage, setInputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const goToAssistant = () => {
    setDrawerOpen(false);
    router.push(`/${locale}/assistant`);
  };

  // Don't show on assistant page
  const isOnAssistantPage = pathname.includes('/assistant');
  if (!isMounted || isOnAssistantPage) return null;

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-label={t('widget.title')}
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          style={{ maxHeight: 'min(600px, calc(100vh - 120px))' }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-base">
                🌾
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t('widget.title')}</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}
                  />
                  <span className="text-xs text-zinc-500">
                    {status === 'thinking' ? t('hero.thinking') : t('hero.online')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={goToAssistant}
                className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-800"
                aria-label={t('widget.openFull')}
              >
                {t('widget.openFull')} ↗
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 flex items-center justify-center transition-colors"
                aria-label={t('widget.close')}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto min-h-0" style={{ minHeight: '200px' }}>
            <MessageRenderer
              messages={messages.slice(-10)}
              locale={locale}
              isStreaming={isStreaming}
              showAudio={false}
            />
          </div>

          {/* Waveform when recording */}
          {recordingState === 'recording' && (
            <div className="px-4 py-2 border-t border-zinc-800">
              <VoiceWaveform amplitudes={waveformData} isActive height={32} />
            </div>
          )}

          {/* Input */}
          <div className="border-t border-zinc-800 px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('widget.placeholder')}
                disabled={isStreaming}
                aria-label={t('widget.placeholder')}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isStreaming}
                aria-label={t('input.send')}
                className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 text-white flex items-center justify-center transition-colors disabled:cursor-not-allowed flex-shrink-0"
              >
                {isStreaming ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setDrawerOpen(!isDrawerOpen)}
        aria-label={t('widget.askVayukrishi')}
        aria-expanded={isDrawerOpen}
        className="fixed bottom-6 right-4 sm:right-6 z-50 group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
        style={{ padding: '12px 18px' }}
      >
        {/* Ping indicator */}
        {!isDrawerOpen && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75" />
        )}
        <span className="text-xl leading-none">🌾</span>
        <span className="text-sm font-semibold whitespace-nowrap">{t('widget.askVayukrishi')}</span>
        {isDrawerOpen && (
          <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </>
  );
};

export default AssistantWidget;
