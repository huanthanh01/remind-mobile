/**
 * Forum post card – used in the post list.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import type { PostType } from '../../stores/types';

interface PostCardProps {
  post: PostType;
  onPress: (postId: string) => void;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function PostCard({ post, onPress }: PostCardProps) {
  const authorName = post.isAnonymous
    ? 'Ẩn danh'
    : post.authorName || post.author?.fullName || 'Người dùng';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(post._id)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Avatar
          name={post.isAnonymous ? undefined : authorName}
          uri={post.isAnonymous ? undefined : post.author?.avatar}
          size={36}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      {/* Content preview */}
      <Text style={styles.content} numberOfLines={3}>
        {post.content}
      </Text>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tags}>
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} text={tag} variant="brand" />
          ))}
        </View>
      )}

      {/* Footer stats */}
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={16} color={Ink[400]} />
          <Text style={styles.statText}>{post.likesCount || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={16} color={Ink[400]} />
          <Text style={styles.statText}>{post.commentsCount || 0}</Text>
        </View>
        {post.forumName && (
          <View style={styles.forumTag}>
            <Ionicons name="folder-outline" size={12} color={Ink[400]} />
            <Text style={styles.forumTagText}>{post.forumName}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
  },
  timeAgo: {
    fontSize: FontSize.xs,
    color: Ink[400],
    marginTop: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  content: {
    fontSize: FontSize.sm,
    color: Ink[500],
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: FontSize.xs,
    color: Ink[400],
  },
  forumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  forumTagText: {
    fontSize: FontSize.xs,
    color: Ink[400],
  },
});
