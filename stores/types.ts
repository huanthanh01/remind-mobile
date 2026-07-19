/**
 * Shared TypeScript types for the ReMind mobile app.
 * Ported from web frontend controllers and models.
 */

/* ───── Auth ───── */

export type UserRole = 'student' | 'expert' | 'admin' | 'system_manager';
export type UserStatus = 'active' | 'pending' | 'rejected' | 'banned';

export interface UserDto {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  isAnonymous?: boolean;
}

export interface AuthResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

/* ───── Forum ───── */

export interface ForumType {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface PostAuthor {
  _id: string;
  fullName?: string;
  avatar?: string;
  role?: string;
}

export interface PostType {
  _id: string;
  title: string;
  content: string;
  author?: PostAuthor;
  authorName?: string;
  forum?: ForumType | string;
  forumName?: string;
  tags?: string[];
  isAnonymous?: boolean;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentType {
  _id: string;
  content: string;
  author?: PostAuthor;
  authorName?: string;
  isAnonymous?: boolean;
  createdAt: string;
  updatedAt?: string;
  replies?: CommentType[];
}

/* ───── AI Chat ───── */

export interface AIChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

/* ───── Expert ───── */

export interface ExpertSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Expert {
  _id: string;
  fullName: string;
  avatar?: string;
  title?: string;
  specialties?: string[];
  education?: string;
  experience?: string;
  rating?: number;
  reviewCount?: number;
  pricePerSession?: number;
  availableSlots?: ExpertSlot[];
}

/* ───── Notification ───── */

export interface NotificationType {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}
