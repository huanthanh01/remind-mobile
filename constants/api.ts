import { API_BASE_URL } from './config';

/**
 * API endpoint constants – mirrors the web frontend's utils/constants.tsx
 * so both clients hit the same remind-backend routes.
 */
export const API_ENDPOINTS = {
  // Health check
  HEALTH: `${API_BASE_URL.replace('/api', '')}/health`,

  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },

  // User profile
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
    AVATAR: `${API_BASE_URL}/users/avatar`,
  },

  // Public expert endpoints
  EXPERTS: {
    DASHBOARD: `${API_BASE_URL}/experts/me/dashboard`,
    SETTINGS: `${API_BASE_URL}/experts/me/settings`,
    LIST_APPROVED: `${API_BASE_URL}/experts`,
    CREDENTIALS: `${API_BASE_URL}/experts/me/credentials`,
  },

  // Forums
  FORUMS: {
    LIST_FORUMS: `${API_BASE_URL}/forums`,
    SEARCH_POSTS: `${API_BASE_URL}/forums/search`,
    POST_DETAIL: (postId: string) => `${API_BASE_URL}/forums/posts/${postId}`,
    UPDATE_POST: (postId: string) => `${API_BASE_URL}/forums/posts/${postId}`,
    DELETE_POST: (postId: string) => `${API_BASE_URL}/forums/posts/${postId}`,
    CREATE_POST: `${API_BASE_URL}/forums/posts`,
    LIST_POSTS: `${API_BASE_URL}/forums/posts`,
    COMMENTS: `${API_BASE_URL}/forums/comments`,
    UPDATE_COMMENT: (commentId: string) =>
      `${API_BASE_URL}/forums/comments/${commentId}`,
    DELETE_COMMENT: (commentId: string) =>
      `${API_BASE_URL}/forums/comments/${commentId}`,
    CREATE_COMMENT: (postId: string) =>
      `${API_BASE_URL}/forums/posts/${postId}/comments`,
  },

  // AI chat
  AI: {
    CHAT: `${API_BASE_URL}/ai/chat`,
  },

  // Expert chat
  CHATS: {
    LIST: `${API_BASE_URL}/chats`,
    ROOM: (roomId: string) => `${API_BASE_URL}/chats/${roomId}`,
    MESSAGES: (roomId: string) => `${API_BASE_URL}/chats/${roomId}/messages`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications`,
    MARK_READ: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/read-all`,
  },

  // Appointments
  APPOINTMENTS: {
    BOOK: `${API_BASE_URL}/appointments/book`,
    MINE: `${API_BASE_URL}/appointments/mine`,
    EXPERT: `${API_BASE_URL}/appointments/expert`,
    CANCEL: (id: string) => `${API_BASE_URL}/appointments/${id}/cancel`,
    START: (id: string) => `${API_BASE_URL}/appointments/${id}/start`,
    END: (id: string) => `${API_BASE_URL}/appointments/${id}/end`,
  },

  // Payments
  PAYMENTS: {
    PRODUCTS: `${API_BASE_URL}/payments/products`,
    CREATE: `${API_BASE_URL}/payments/payos`,
    LIST: `${API_BASE_URL}/payments`,
    WALLET: `${API_BASE_URL}/payments/wallet`,
    APPOINTMENT: `${API_BASE_URL}/payments/appointment`,
  },
};
