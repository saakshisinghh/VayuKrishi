import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Message } from '../types/message.types';
import { AssistantLanguage, AssistantStatus } from '../types/assistant.types';

interface AssistantState {
  messages: Message[];
  conversationId: string | null;
  isStreaming: boolean;
  streamingMessageId: string | null;
  status: AssistantStatus;
  selectedLanguage: AssistantLanguage;
  isDrawerOpen: boolean;
  inputText: string;
  addMessage: (message: Message) => void;
  updateStreamingMessage: (id: string, token: string) => void;
  finalizeStreamingMessage: (id: string) => void;
  setConversationId: (id: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  setStreamingMessageId: (id: string | null) => void;
  setStatus: (status: AssistantStatus) => void;
  setSelectedLanguage: (lang: AssistantLanguage) => void;
  setDrawerOpen: (open: boolean) => void;
  setInputText: (text: string) => void;
  clearMessages: () => void;
  cancelStreaming: () => void;
}

export const useAssistantStore = create<AssistantState>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        conversationId: null,
        isStreaming: false,
        streamingMessageId: null,
        status: 'online',
        selectedLanguage: 'en',
        isDrawerOpen: false,
        inputText: '',

        addMessage: (message) =>
          set((state) => ({ messages: [...state.messages, message] })),

        updateStreamingMessage: (id, token) =>
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === id && m.type === 'text'
                ? { ...m, content: (m as any).content + token }
                : m
            ),
          })),

        finalizeStreamingMessage: (id) =>
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === id ? { ...m, isStreaming: false } : m
            ),
            isStreaming: false,
            streamingMessageId: null,
          })),

        setConversationId: (id) => set({ conversationId: id }),
        setIsStreaming: (streaming) => set({ isStreaming: streaming }),
        setStreamingMessageId: (id) => set({ streamingMessageId: id }),
        setStatus: (status) => set({ status }),
        setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
        setDrawerOpen: (open) => set({ isDrawerOpen: open }),
        setInputText: (text) => set({ inputText: text }),
        clearMessages: () => set({ messages: [], conversationId: null }),
        cancelStreaming: () => {
          const { streamingMessageId } = get();
          if (streamingMessageId) {
            set((state) => ({
              messages: state.messages.map((m) =>
                m.id === streamingMessageId
                  ? { ...m, isStreaming: false }
                  : m
              ),
              isStreaming: false,
              streamingMessageId: null,
            }));
          }
        },
      }),
      {
        name: 'vayukrishi-assistant',
        partialize: (state) => ({
          selectedLanguage: state.selectedLanguage,
          conversationId: state.conversationId,
        }),
      }
    )
  )
);
