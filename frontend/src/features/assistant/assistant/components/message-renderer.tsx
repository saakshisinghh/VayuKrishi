'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '../types/message.types';
import { ChatMessage } from './chat-message';
import { useTranslations } from 'next-intl';

interface MessageRendererProps {
  messages: Message[];
  locale: string;
  isStreaming: boolean;
  showAudio?: boolean;
}

const WelcomeState: React.FC = () => {
  const t = useTranslations('assistant');
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <span className="text-4xl">🌾</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-zinc-200">{t('welcome.title')}</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-xs leading-relaxed">{t('welcome.subtitle')}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {['🌱', '🌡️', '💧', '📊'].map((icon, i) => (
          <div key={i} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl">
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export const MessageRenderer: React.FC<MessageRendererProps> = ({
  messages,
  locale,
  isStreaming,
  showAudio = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isStreaming]);

  if (messages.length === 0) return <WelcomeState />;

  return (
    <div className="flex flex-col gap-4 py-4 px-4">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          locale={locale}
          showAudio={showAudio}
        />
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
};

export default MessageRenderer;
