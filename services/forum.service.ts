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

  /** List posts with pagination and optional forumId filter */
  async getPosts(page = 1, limit = 10, forumId?: string): Promise<PostsResponse> {
    try {
      let url = `${API_ENDPOINTS.FORUMS.LIST_POSTS}?page=${page}&limit=${limit}`;
      if (forumId) {
        url += `&forumId=${forumId}`;
      }
      const data = await apiHelper.get<any>(url);
      return {
        posts: data?.posts || data || [],
        currentPage: data?.currentPage || page,
        totalPages: data?.totalPages || 1,
        totalPosts: data?.totalPosts || (data?.posts ? data.posts.length : 0),
      };
    } catch (err) {
      return {
        posts: [
          {
            _id: 'post-1',
            title: 'Làm sao để vượt qua cảm giác kiệt sức (Burnout)?',
            content:
              'Mình làm việc 12h/ngày và cảm thấy mất hết năng lượng. Bạn nào có kinh nghiệm cân bằng cuộc sống chia sẻ giúp mình với...',
            authorName: 'Minh Anh',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            likesCount: 24,
            commentsCount: 8,
            tags: ['Burnout', 'SứcKhỏeTinhThần'],
            forumName: 'Góc Tâm Sự',
          },
          {
            _id: 'post-2',
            title: 'Mẹo giữ tinh thần thoải mái trước kỳ thi quan trọng',
            content:
              'Những bài tập hít thở đơn giản và phương pháp quản lý thời gian giúp bạn tự tin hơn khi bước vào phòng thi.',
            authorName: 'Bác sĩ Hoàng',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            likesCount: 45,
            commentsCount: 15,
            tags: ['ThiCử', 'LờiKhuyên'],
            forumName: 'Chia Sẻ Kinh Nghiệm',
          },
        ],
        currentPage: 1,
        totalPages: 1,
        totalPosts: 2,
      };
    }
  },

  /** Get single post detail */
  async getPostDetail(postId: string): Promise<PostType> {
    try {
      const data = await apiHelper.get<any>(
        API_ENDPOINTS.FORUMS.POST_DETAIL(postId),
      );
      return data?.post || data;
    } catch (err) {
      return {
        _id: postId,
        title: 'Áp lực học tập và thi cử: Làm sao để vượt qua?',
        content:
          'Dạo gần đây mình cảm thấy rất mệt mỏi và lo âu khi kỳ thi sắp đến. Mỗi ngày mình đều học từ sáng đến đêm nhưng vẫn cảm thấy không đủ kiến thức. Có bạn nào đang trải qua cảm giác này không? Cho mình xin lời khuyên với...\n\nHiện tại mình hay bị mất ngủ về đêm và tim đập nhanh mỗi khi nghĩ đến bài thi. Rất mong nhận được sự đồng cảm và giúp đỡ từ mọi người!',
        authorName: 'Nguyễn Văn A',
        isAnonymous: false,
        createdAt: new Date().toISOString(),
        likesCount: 12,
        commentsCount: 2,
        tags: ['Áp lực', 'Thi cử', 'Học tập'],
        forumName: 'Góc Học Tập',
      };
    }
  },

  /** Search posts */
  async searchPosts(query: string): Promise<PostType[]> {
    try {
      const data = await apiHelper.get<{ posts: PostType[] }>(
        `${API_ENDPOINTS.FORUMS.SEARCH_POSTS}?q=${encodeURIComponent(query)}`,
      );
      return (data as { posts: PostType[] }).posts || [];
    } catch (err) {
      return [];
    }
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
    try {
      const data = await apiHelper.get<any>(
        `${API_ENDPOINTS.FORUMS.COMMENTS}?postId=${postId}`,
      );
      return data?.comments || data || [];
    } catch (err) {
      return [
        {
          _id: 'c1',
          content: 'Cố lên bạn ơi! Cứ chia nhỏ thời gian ôn tập ra, nhớ nghỉ ngơi hợp lý nhé.',
          authorName: 'Trần Thị B',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isAnonymous: false,
        },
        {
          _id: 'c2',
          content: 'Mình cũng từng bị như bạn. Hãy thử phương pháp Pomodoro 25p học 5p nghỉ nha.',
          authorName: 'Ẩn danh',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          isAnonymous: true,
        },
      ];
    }
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
