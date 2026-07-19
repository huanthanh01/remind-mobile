/**
 * AI chat service – mirrors web AIController.
 */

import { getToken, TokenKeys } from './api';
import { API_BASE_URL } from '../constants/config';

interface ChatHistoryItem {
  role: string;
  text: string;
}

export const AIService = {
  /** Send a message to the AI and receive a reply */
  async sendMessage(prompt: string, history: ChatHistoryItem[] = []): Promise<string> {
    const token = await getToken(TokenKeys.ACCESS);

    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
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
};
