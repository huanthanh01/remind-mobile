/**
 * AI chat service – implements both standard fetch and SSE for streaming.
 */

// @ts-ignore
import EventSource from 'react-native-sse';
import { getToken, TokenKeys } from './api';
import { API_BASE_URL } from '../constants/config';
import { API_ENDPOINTS } from '../constants/api';

interface ChatHistoryItem {
  role: string;
  text: string;
}

export const AIService = {
  /** Send a message to the AI and receive a reply (non-streaming final output) */
  async sendMessage(prompt: string, history: ChatHistoryItem[] = []): Promise<string> {
    const token = await getToken(TokenKeys.ACCESS);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      throw new Error('Failed to connect to AI server');
    }

    const responseText = await response.text();
    const lines = responseText.split('\n');
    let reply = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data:')) {
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.text) {
            reply += parsed.text;
          }
        } catch (e) {
          // ignore
        }
      }
    }

    return reply || 'Xin lỗi, tớ chưa hiểu ý bạn.';
  },

  /** Send a message to the AI and receive a stream reply */
  async sendMessageStream(
    prompt: string,
    history: ChatHistoryItem[],
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (err: any) => void
  ): Promise<void> {
    const token = await getToken(TokenKeys.ACCESS);
    const url = `${API_BASE_URL}${API_ENDPOINTS.AI.CHAT}`;
    
    const es = new EventSource(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ prompt, history }),
    });

    es.addEventListener('message', (event: any) => {
      if (event.data) {
        if (event.data === '[DONE]') {
          es.close();
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.text) {
            onChunk(parsed.text);
          } else if (parsed.error) {
            es.close();
            onError(new Error(parsed.error));
          }
        } catch (e) {
          // ignore JSON parse error for incomplete chunks
        }
      }
    });

    es.addEventListener('error', (error: any) => {
      es.close();
      onError(error);
    });
  },
};
