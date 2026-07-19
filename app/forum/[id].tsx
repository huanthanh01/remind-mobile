/**
 * Forum post detail screen (dynamic route).
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../stores/auth.store';
import { ForumService } from '../../services/forum.service';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CommentSection from '../../components/forum/CommentSection';
import AuthModal from '../../components/common/AuthModal';
import type { PostType, CommentType } from '../../stores/types';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ForumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [postData, commentsData] = await Promise.all([
        ForumService.getPostDetail(id),
        ForumService.getComments(id),
      ]);
      setPost(postData);
      setComments(commentsData || []);
    } catch (err) {
      console.error('Failed to load post detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
    }
    fetchData();
  }, [id, isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAddComment = async (content: string, isAnonymous: boolean) => {
    if (!id) return;
    const newComment = await ForumService.createComment(id, content, isAnonymous);
    setComments((prev) => [newComment, ...prev]);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải bài viết..." />;
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy bài viết</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const authorName = post.isAnonymous
    ? 'Ẩn danh'
    : post.authorName || post.author?.fullName || 'Người dùng';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Ink[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chi tiết bài viết
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Brand[700]} />
        }
      >
        {/* Post content */}
        <View style={styles.postCard}>
          {/* Author */}
          <View style={styles.authorRow}>
            <Avatar
              name={post.isAnonymous ? undefined : authorName}
              uri={post.isAnonymous ? undefined : post.author?.avatar}
              size={40}
            />
            <View>
              <Text style={styles.authorName}>{authorName}</Text>
              <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.postTitle}>{post.title}</Text>

          {/* Content */}
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tags}>
              {post.tags.map((tag) => (
                <Badge key={tag} text={tag} variant="brand" />
              ))}
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="heart-outline" size={18} color={Ink[400]} />
              <Text style={styles.statText}>{post.likesCount || 0} lượt thích</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={18} color={Ink[400]} />
              <Text style={styles.statText}>{comments.length} bình luận</Text>
            </View>
          </View>
        </View>

        {/* Comments */}
        <View style={styles.commentsContainer}>
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            isLoggedIn={isAuthenticated}
            onLoginRequired={() => setAuthModalVisible(true)}
          />
        </View>
      </ScrollView>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        title="Tính năng dành cho thành viên"
        message="Vui lòng đăng nhập hoặc tạo tài khoản để đọc chi tiết bài viết và tham gia thảo luận cùng cộng đồng."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Surface.white,
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.md,
    color: Ink[500],
  },
  backLink: {
    fontSize: FontSize.base,
    color: Brand[700],
    fontWeight: FontWeight.semibold,
  },
  postCard: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  authorName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
  },
  postDate: {
    fontSize: FontSize.xs,
    color: Ink[400],
    marginTop: 2,
  },
  postTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginBottom: Spacing.md,
    lineHeight: 26,
  },
  postContent: {
    fontSize: FontSize.base,
    color: Ink[700],
    lineHeight: 24,
    marginBottom: Spacing.base,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: FontSize.sm,
    color: Ink[400],
  },
  commentsContainer: {
    marginTop: Spacing.xl,
  },
});
