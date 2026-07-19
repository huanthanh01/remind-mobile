/**
 * AI chat service – mirrors web AIController.
 */

import { apiHelper } from './api';
import { API_ENDPOINTS } from '../constants/api';

export const AIService = {
  /** Send a message to the AI and receive a reply */
  async sendMessage(message: string): Promise<string> {
    const data = await apiHelper.post<{ reply: string }>(
      API_ENDPOINTS.AI.CHAT,
      { message },
    );
    return (data as { reply: string }).reply;
  },
};
