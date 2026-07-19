/**
 * Comment section for forum post detail.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import Avatar from '../common/Avatar';
import type { CommentType } from '../../stores/types';

interface CommentSectionProps {
  comments: CommentType[];
  onAddComment: (content: string, isAnonymous: boolean) => Promise<void>;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function CommentItem({ comment }: { comment: CommentType }) {
  const name = comment.isAnonymous
    ? 'Ẩn danh'
    : comment.authorName || comment.author?.fullName || 'Người dùng';

  return (
    <View style={styles.commentItem}>
      <Avatar
        name={comment.isAnonymous ? undefined : name}
        uri={comment.isAnonymous ? undefined : comment.author?.avatar}
        size={32}
      />
      <View style={styles.commentBody}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{name}</Text>
          <Text style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
        </View>
        <Text style={styles.commentContent}>{comment.content}</Text>
      </View>
    </View>
  );
}

export default function CommentSection({
  comments,
  onAddComment,
  isLoggedIn,
  onLoginRequired,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    if (!newComment.trim()) return;

    setIsPosting(true);
    try {
      await onAddComment(newComment.trim(), isAnonymous);
      setNewComment('');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể gửi bình luận');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Bình luận ({comments.length})
      </Text>

      {/* Comment input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={isLoggedIn ? 'Viết bình luận...' : 'Đăng nhập để bình luận'}
            placeholderTextColor={Ink[400]}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            editable={isLoggedIn}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!newComment.trim() || isPosting) && styles.sendBtnDisabled]}
            onPress={handleSubmit}
            disabled={!newComment.trim() || isPosting}
          >
            <Ionicons
              name="send"
              size={18}
              color={newComment.trim() && !isPosting ? '#fff' : Ink[400]}
            />
          </TouchableOpacity>
        </View>
        {isLoggedIn && (
          <View style={styles.anonRow}>
            <Ionicons name="eye-off-outline" size={14} color={Ink[400]} />
            <Text style={styles.anonText}>Ẩn danh</Text>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: Surface.border, true: Brand[300] }}
              thumbColor={isAnonymous ? Brand[700] : '#f4f3f4'}
              style={styles.switch}
            />
          </View>
        )}
      </View>

      {/* Comments list */}
      {comments.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có bình luận nào. Hãy là người đầu tiên!</Text>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
    marginBottom: Spacing.base,
  },
  inputContainer: {
    backgroundColor: Surface.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Surface.border,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Ink[900],
    maxHeight: 80,
    paddingVertical: Spacing.sm,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Surface.muted,
  },
  anonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  anonText: {
    fontSize: FontSize.xs,
    color: Ink[400],
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Ink[400],
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  commentItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
  },
  commentTime: {
    fontSize: FontSize.xs,
    color: Ink[400],
  },
  commentContent: {
    fontSize: FontSize.sm,
    color: Ink[700],
    lineHeight: 20,
  },
});
