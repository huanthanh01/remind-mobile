/**
 * Chat service – REST list/messages + Socket.io.
 * Mirrors web Chat.tsx endpoints (API_ENDPOINTS.CHATS).
 */

import { io, Socket } from 'socket.io-client';
import { apiHelper, getToken } from './api';
import { BASE_URL } from '../constants/config';

export interface ChatRoom {
  _id: string;
  appointmentId?: string;
  participants: { userId: { _id: string; fullName: string; avatarUrl?: string; role?: string } }[];
  lastMessage?: { text: string; senderId: string; sentAt: string };
  unreadCount?: number;
  updatedAt?: string;
}

export interface ChatMessage {
  _id: string;
  chatRoomId: string;
  senderId: string | { _id: string };
  text: string;
  createdAt: string;
  type?: string;
}

export const ChatService = {
  listRooms: async (): Promise<ChatRoom[]> => {
    const res = await apiHelper.get<{ rooms: ChatRoom[] }>('/chats');
    return res.rooms || [];
  },

  listMessages: async (roomId: string, cursor?: string): Promise<{ messages: ChatMessage[]; hasNext: boolean }> => {
    const url = cursor
      ? `/chats/${roomId}/messages?limit=10&cursor=${cursor}`
      : `/chats/${roomId}/messages?limit=10`;
    return apiHelper.get(url);
  },

  // ponytail: single shared socket per session; component owns lifecycle
  connectSocket: async (): Promise<Socket> => {
    const token = await getToken('accessToken');
    return io(BASE_URL, { auth: { token }, transports: ['websocket'] });
  },
};
