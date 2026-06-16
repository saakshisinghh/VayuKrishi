'use client';

import React from 'react';
import { Message, RecommendationMessage, DiseaseMessage, ForecastMessage, FarmPlanMessage } from '../types/message.types';
import { StreamingMessage } from './streaming-message';
import { ContextCard } from './context-card';
import { AudioResponsePlayer } from './audio-response-player';
import { useTranslations } from 'next-intl';

interface ChatMessageProps {
  message: Message;
  locale: string;
  showAudio?: boolean;
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

const RecommendationCard: React.FC<{ msg: RecommendationMessage }> = ({ msg }) => (
  <div className="mt-3 space-y-2">
    {msg.recommendations.map((rec, i) => (
      <div key={i} className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-white text-sm">🌾 {rec.cropLocal || rec.crop}</span>
          <span className="text-xs font-bold text-emerald-400">{rec.confidence}%</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">{rec.reason}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">
            📅 {rec.season}
          </span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">
            📦 {rec.expectedYield}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const DiseaseCard: React.FC<{ msg: DiseaseMessage }> = ({ msg }) => {
  const riskColors = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  };
  return (
    <div className="mt-3 space-y-2">
      <div className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full border px-2 py-0.5 ${riskColors[msg.riskLevel]}`}>
        ⚠️ {msg.riskLevel.toUpperCase()} RISK
      </div>
      {msg.diseases.map((d, i) => (
        <div key={i} className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-white text-sm">🦠 {d.nameLocal || d.name}</span>
            <span className="text-xs text-amber-400 font-bold">{d.probability}%</span>
          </div>
          <p className="text-xs text-red-400 mb-1">Severity: {d.severity}</p>
          {d.prevention.length > 0 && (
            <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-0.5">
              {d.prevention.map((p, pi) => <li key={pi}>{p}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

const ForecastCard: React.FC<{ msg: ForecastMessage }> = ({ msg }) => (
  <div className="mt-3 grid grid-cols-2 gap-2">
    {msg.forecast.slice(0, 6).map((f, i) => (
      <div key={i} className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-2.5">
        <p className="text-xs text-zinc-500">{f.date}</p>
        <p className="text-sm font-semibold text-white">{f.condition}</p>
        <p className="text-xs text-blue-400">{f.temperature.min}° – {f.temperature.max}°C</p>
        <p className="text-xs text-cyan-400">💧 {f.rainfall}mm</p>
      </div>
    ))}
  </div>
);

const FarmPlanCard: React.FC<{ msg: FarmPlanMessage }> = ({ msg }) => {
  const priorityColors = { high: 'text-red-400', medium: 'text-amber-400', low: 'text-zinc-400' };
  return (
    <div className="mt-3 space-y-2">
      {msg.plan.map((item, i) => (
        <div key={i} className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-3 flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
            W{item.week}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{item.activityLocal || item.activity}</p>
            <p className={`text-xs font-semibold uppercase mt-0.5 ${priorityColors[item.priority]}`}>{item.priority}</p>
            {item.notes && <p className="text-xs text-zinc-500 mt-1">{item.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main ChatMessage ─────────────────────────────────────────────────────────

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, locale, showAudio }) => {
  const t = useTranslations('assistant');
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const content = (message as any).content ?? '';

  const timeStr = new Date(message.timestamp).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-zinc-600 bg-zinc-800 rounded-full px-3 py-1">{content}</span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
        }`}
      >
        {isUser ? '👤' : '🌾'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-100 rounded-tl-sm'
          }`}
        >
          {/* Streaming */}
          {message.isStreaming ? (
            <StreamingMessage messageId={message.id} content={content} />
          ) : (
            <>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>

              {/* Type-specific cards */}
              {message.type === 'recommendation' && (
                <RecommendationCard msg={message as RecommendationMessage} />
              )}
              {message.type === 'disease' && (
                <DiseaseCard msg={message as DiseaseMessage} />
              )}
              {message.type === 'forecast' && (
                <ForecastCard msg={message as ForecastMessage} />
              )}
              {message.type === 'farm_plan' && (
                <FarmPlanCard msg={message as FarmPlanMessage} />
              )}

              {/* Context card */}
              {!isUser && (message as any).context && (
                <ContextCard context={(message as any).context} />
              )}
            </>
          )}
        </div>

        {/* TTS for AI messages */}
        {!isUser && !message.isStreaming && showAudio && content && (
          <div className="w-full max-w-xs">
            <AudioResponsePlayer text={content} language={message.language} />
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-zinc-600 px-1">{timeStr}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
