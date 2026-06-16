'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assistantService, SendMessageRequest } from '../services/assistant.service';
import { useAssistantStore } from '../store/assistant-store';
import { useMemoryStore } from '../store/memory-store';
import { memoryService } from '../services/memory.service';
import { voiceService } from '../services/voice.service';
import { VoiceRecording, SpeechGenerationRequest } from '../types/voice.types';
import { v4 as uuidv4 } from 'uuid';
import { TextMessage } from '../types/message.types';
import { AssistantLanguage } from '../types/assistant.types';

const QUERY_KEYS = {
  conversation: (id: string) => ['assistant', 'conversation', id],
  conversations: (farmerId: string) => ['assistant', 'conversations', farmerId],
  memory: (farmerId: string) => ['memory', farmerId],
  insights: (farmerId: string) => ['memory', 'insights', farmerId],
};

export function useAssistant() {
  const store = useAssistantStore();
  const { memory } = useMemoryStore();
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: (req: SendMessageRequest) => assistantService.sendMessage(req),
    onSuccess: (data) => {
      store.addMessage(data.message);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(data.message.language),
      });
    },
  });

  const sendMessage = async (content: string, language: AssistantLanguage) => {
    const farmerId = memory?.profile.id ?? 'demo-farmer';
    const conversationId = store.conversationId ?? uuidv4();
    if (!store.conversationId) store.setConversationId(conversationId);

    const userMsg: TextMessage = {
      id: uuidv4(),
      role: 'user',
      type: 'text',
      content,
      language,
      timestamp: new Date(),
    };
    store.addMessage(userMsg);

    const streamingId = uuidv4();
    const streamingMsg: TextMessage = {
      id: streamingId,
      role: 'assistant',
      type: 'text',
      content: '',
      language,
      timestamp: new Date(),
      isStreaming: true,
    };
    store.addMessage(streamingMsg);
    store.setIsStreaming(true);
    store.setStreamingMessageId(streamingId);
    store.setStatus('thinking');

    try {
      for await (const token of assistantService.streamResponse({
        conversationId,
        content,
        language,
        farmerId,
      })) {
        if (!useAssistantStore.getState().isStreaming) break;
        store.updateStreamingMessage(streamingId, token);
      }
    } catch {
      store.updateStreamingMessage(streamingId, '\n\n[Error generating response. Please try again.]');
    } finally {
      store.finalizeStreamingMessage(streamingId);
      store.setStatus('online');
    }
  };

  return { sendMessage, isSending: store.isStreaming, sendMutation };
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.conversation(conversationId),
    queryFn: () => assistantService.getConversation(conversationId),
    enabled: !!conversationId,
  });
}

export function useMemory(farmerId: string) {
  const { setMemory, setLastSynced } = useMemoryStore();

  return useQuery({
    queryKey: QUERY_KEYS.memory(farmerId),
    queryFn: async () => {
      try {
        const data = await memoryService.getMemory(farmerId);
        setMemory(data);
        setLastSynced(new Date());
        return data;
      } catch {
        const mock = memoryService.getMockMemory(farmerId);
        setMemory(mock);
        return mock;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useVoiceTranscription() {
  return useMutation({
    mutationFn: ({
      recording,
      language,
    }: {
      recording: VoiceRecording;
      language: string;
    }) => voiceService.transcribeAudio(recording, language),
  });
}

export function useSpeechGeneration() {
  return useMutation({
    mutationFn: (req: SpeechGenerationRequest) =>
      voiceService.generateSpeech(req),
  });
}
