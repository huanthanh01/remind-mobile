/**
 * AI chat service – implements SSE for streaming.
 */

import EventSource from 'react-native-sse';
import { API_BASE_URL } from '../constants/config';
import { API_ENDPOINTS } from '../constants/api';
import { getToken, TokenKeys } from './api';

export const AIService = {
  /** Send a message to the AI and receive a stream reply */
  async sendMessageStream(
    prompt: string,
    history: { role: string; text: string }[],
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

    es.addEventListener('message', (event) => {
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

    es.addEventListener('error', (error) => {
      es.close();
      onError(error);
    });
  },
};
