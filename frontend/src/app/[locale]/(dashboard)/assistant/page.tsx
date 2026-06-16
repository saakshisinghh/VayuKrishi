'use client';

import React, { Suspense, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { AssistantHero } from '@/features/assistant/components/assistant-hero';
import { AssistantWorkspace } from '@/features/assistant/components/assistant-workspace';
import { AssistantSkeleton } from '@/features/assistant/components/skeletons';
import { MemoryError } from '@/features/assistant/components/error-states';
import { useAssistantStore } from '@/features/assistant/store/assistant-store';
import { useMemoryStore } from '@/features/assistant/store/memory-store';
import { useAssistant, useMemory } from '@/features/assistant/queries/assistant.queries';
import { AssistantLanguage } from '@/features/assistant/types/assistant.types';

// Demo farmer ID – in production, get from auth context
const DEMO_FARMER_ID = 'farmer-001';

function AssistantPageContent() {
  const locale = useLocale() as AssistantLanguage;
  const { status, selectedLanguage, messages, setSelectedLanguage } = useAssistantStore();
  const { memory, isPanelOpen } = useMemoryStore();
  const { sendMessage, isSending } = useAssistant();

  // Set language from locale on mount
  useEffect(() => {
    const validLocales: AssistantLanguage[] = ['en', 'mr', 'hi', 'gu', 'ta', 'kn'];
    if (validLocales.includes(locale)) {
      setSelectedLanguage(locale);
    }
  }, [locale, setSelectedLanguage]);

  const {
    data: memoryData,
    isLoading: isMemoryLoading,
    isError: isMemoryError,
    refetch: refetchMemory,
  } = useMemory(DEMO_FARMER_ID);

  const handleSend = (content: string, language: AssistantLanguage) => {
    sendMessage(content, language);
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero */}
      <AssistantHero
        status={status}
        language={selectedLanguage}
        memoryEnabled={!!memory}
        messageCount={messages.length}
      />

      {/* Memory error banner */}
      {isMemoryError && (
        <MemoryError onRetry={() => refetchMemory()} />
      )}

      {/* Main workspace */}
      <AssistantWorkspace
        language={selectedLanguage}
        memory={memoryData ?? null}
        isMemoryLoading={isMemoryLoading}
        onSend={handleSend}
        showAudio={true}
      />
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<AssistantSkeleton />}>
      <AssistantPageContent />
    </Suspense>
  );
}
