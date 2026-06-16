import { Message, ConversationSession } from '../types/message.types';
import { AssistantContext, AssistantLanguage } from '../types/assistant.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  language: AssistantLanguage;
  farmerId: string;
  useMemory?: boolean;
}

export interface SendMessageResponse {
  message: Message;
  context?: AssistantContext;
  conversationId: string;
}

export interface StreamResponseRequest {
  conversationId: string;
  content: string;
  language: AssistantLanguage;
  farmerId: string;
}

export const assistantService = {
  async sendMessage(req: SendMessageRequest): Promise<SendMessageResponse> {
    const res = await fetch(`${API_BASE}/assistant/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.statusText}`);
    return res.json();
  },

  async *streamResponse(req: StreamResponseRequest): AsyncGenerator<string> {
    const res = await fetch(`${API_BASE}/assistant/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok || !res.body) throw new Error('Stream failed');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) yield parsed.token;
          } catch {
            // skip malformed chunks
          }
        }
      }
    }
  },

  async getConversation(conversationId: string): Promise<ConversationSession> {
    const res = await fetch(`${API_BASE}/assistant/conversations/${conversationId}`);
    if (!res.ok) throw new Error('Failed to fetch conversation');
    return res.json();
  },

  async getConversations(farmerId: string): Promise<ConversationSession[]> {
    const res = await fetch(`${API_BASE}/assistant/conversations?farmerId=${farmerId}`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/assistant/conversations/${conversationId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete conversation');
  },

  async createConversation(farmerId: string, language: AssistantLanguage): Promise<ConversationSession> {
    const res = await fetch(`${API_BASE}/assistant/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmerId, language }),
    });
    if (!res.ok) throw new Error('Failed to create conversation');
    return res.json();
  },
};
