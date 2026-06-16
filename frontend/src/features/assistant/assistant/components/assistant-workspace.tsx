'use client';

import React from 'react';
import { AssistantChat } from './assistant-chat';
import { MemoryPanel } from './memory-panel';
import { FarmerMemory } from '../types/memory.types';
import { AssistantLanguage } from '../types/assistant.types';
import { useMemoryStore } from '../store/memory-store';

interface AssistantWorkspaceProps {
  language: AssistantLanguage;
  memory: FarmerMemory | null;
  isMemoryLoading: boolean;
  onSend: (content: string, language: AssistantLanguage) => void;
  showAudio?: boolean;
}

export const AssistantWorkspace: React.FC<AssistantWorkspaceProps> = ({
  language,
  memory,
  isMemoryLoading,
  onSend,
  showAudio = false,
}) => {
  const { isPanelOpen, setIsPanelOpen } = useMemoryStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-280px)] min-h-[500px]">
      {/* Memory sidebar */}
      <div className="flex flex-col gap-4 overflow-y-auto lg:block">
        <MemoryPanel
          memory={memory}
          isLoading={isMemoryLoading}
          locale={language}
          isOpen={isPanelOpen}
          onToggle={() => setIsPanelOpen(!isPanelOpen)}
        />

        {/* Language sync status */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <p className="text-xs font-medium text-zinc-500 mb-2">🌐 Language Sync</p>
          <div className="space-y-1.5">
            {[
              { label: 'UI', status: true },
              { label: 'Chat', status: true },
              { label: 'Voice Input', status: true },
              { label: 'Voice Output', status: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{item.label}</span>
                <span className={`flex items-center gap-1 font-medium ${item.status ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  {item.status ? '✓' : '—'}
                  <span className="uppercase">{language}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0">
        <AssistantChat
          language={language}
          onSend={onSend}
          showAudio={showAudio}
        />
      </div>
    </div>
  );
};

export default AssistantWorkspace;
