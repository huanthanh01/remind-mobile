/**
 * Forum service – mirrors web ForumController + forumService.
 */

import { apiHelper } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { ForumType, PostType, CommentType } from '../stores/types';

interface PostsResponse {
  posts: PostType[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export const ForumService = {
  /** List available forums */
  async getForums(): Promise<ForumType[]> {
    const data = await apiHelper.get<{ forums: ForumType[] }>(
      API_ENDPOINTS.FORUMS.LIST_FORUMS,
    );
    return (data as { forums: ForumType[] }).forums || [];
  },

  /** List posts with pagination */
  async getPosts(page = 1, limit = 10): Promise<PostsResponse> {
    const data = await apiHelper.get<PostsResponse>(
      `${API_ENDPOINTS.FORUMS.LIST_POSTS}?page=${page}&limit=${limit}`,
    );
    return data as PostsResponse;
  },

  /** Get single post detail */
  async getPostDetail(postId: string): Promise<PostType> {
    const data = await apiHelper.get<{ post: PostType }>(
      API_ENDPOINTS.FORUMS.POST_DETAIL(postId),
    );
    return (data as { post: PostType }).post;
  },

  /** Search posts */
  async searchPosts(query: string): Promise<PostType[]> {
    const data = await apiHelper.get<{ posts: PostType[] }>(
      `${API_ENDPOINTS.FORUMS.SEARCH_POSTS}?q=${encodeURIComponent(query)}`,
    );
    return (data as { posts: PostType[] }).posts || [];
  },

  /** Create a new post */
  async createPost(payload: {
    title: string;
    content: string;
    forum: string;
    tags?: string[];
    isAnonymous?: boolean;
  }): Promise<PostType> {
    const data = await apiHelper.post<{ post: PostType }>(
      API_ENDPOINTS.FORUMS.CREATE_POST,
      payload,
    );
    return (data as { post: PostType }).post;
  },

  /** Get comments for a post */
  async getComments(postId: string): Promise<CommentType[]> {
    const data = await apiHelper.get<{ comments: CommentType[] }>(
      `${API_ENDPOINTS.FORUMS.COMMENTS}?postId=${postId}`,
    );
    return (data as { comments: CommentType[] }).comments || [];
  },

  /** Create a comment on a post */
  async createComment(
    postId: string,
    content: string,
    isAnonymous?: boolean,
  ): Promise<CommentType> {
    const data = await apiHelper.post<{ comment: CommentType }>(
      API_ENDPOINTS.FORUMS.CREATE_COMMENT(postId),
      { content, isAnonymous },
    );
    return (data as { comment: CommentType }).comment;
  },

  /** Delete a comment */
  async deleteComment(commentId: string): Promise<void> {
    await apiHelper.delete(API_ENDPOINTS.FORUMS.DELETE_COMMENT(commentId));
  },
};
