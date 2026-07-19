/**
 * Create post modal for forum.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Semantic, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import Button from '../common/Button';
import { ForumService } from '../../services/forum.service';
import type { ForumType } from '../../stores/types';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export default function CreatePostModal({
  visible,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const [forums, setForums] = useState<ForumType[]>([]);
  const [selectedForumId, setSelectedForumId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [errors, setErrors] = useState({ title: false, forum: false, content: false });

  useEffect(() => {
    if (visible) {
      ForumService.getForums().then(setForums).catch(() => {});
    }
  }, [visible]);

  const handlePost = async () => {
    const newErrors = {
      title: !title.trim(),
      forum: !selectedForumId,
      content: !content.trim(),
    };
    setErrors(newErrors);
    if (newErrors.title || newErrors.forum || newErrors.content) return;

    setIsPosting(true);
    try {
      const tags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await ForumService.createPost({
        title: title.trim(),
        content: content.trim(),
        forum: selectedForumId,
        tags,
        isAnonymous,
      });
      // Reset
      setTitle('');
      setContent('');
      setTagsText('');
      setSelectedForumId('');
      setIsAnonymous(false);
      onPostCreated();
      onClose();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo bài viết');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Ink[700]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo bài viết mới</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Forum selector */}
          <Text style={styles.label}>Diễn đàn *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forumRow}>
            {forums.map((forum) => (
              <TouchableOpacity
                key={forum._id}
                style={[
                  styles.forumChip,
                  selectedForumId === forum._id && styles.forumChipActive,
                ]}
                onPress={() => {
                  setSelectedForumId(forum._id);
                  setErrors((e) => ({ ...e, forum: false }));
                }}
              >
                <Text
                  style={[
                    styles.forumChipText,
                    selectedForumId === forum._id && styles.forumChipTextActive,
                  ]}
                >
                  {forum.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.forum && <Text style={styles.errorText}>Vui lòng chọn diễn đàn</Text>}

          {/* Title */}
          <Text style={styles.label}>Tiêu đề *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Nhập tiêu đề bài viết..."
            placeholderTextColor={Ink[400]}
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              setErrors((e) => ({ ...e, title: false }));
            }}
          />
          {errors.title && <Text style={styles.errorText}>Tiêu đề không được để trống</Text>}

          {/* Content */}
          <Text style={styles.label}>Nội dung *</Text>
          <TextInput
            style={[styles.input, styles.contentInput, errors.content && styles.inputError]}
            placeholder="Chia sẻ câu chuyện của bạn..."
            placeholderTextColor={Ink[400]}
            value={content}
            onChangeText={(t) => {
              setContent(t);
              setErrors((e) => ({ ...e, content: false }));
            }}
            multiline
            textAlignVertical="top"
          />
          {errors.content && <Text style={styles.errorText}>Nội dung không được để trống</Text>}

          {/* Tags */}
          <Text style={styles.label}>Tags (phân cách bằng dấu phẩy)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: áp lực, lo âu, ..."
            placeholderTextColor={Ink[400]}
            value={tagsText}
            onChangeText={setTagsText}
          />

          {/* Anonymous toggle */}
          <View style={styles.anonRow}>
            <Ionicons name="eye-off-outline" size={20} color={Ink[500]} />
            <Text style={styles.anonLabel}>Đăng ẩn danh</Text>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: Surface.border, true: Brand[300] }}
              thumbColor={isAnonymous ? Brand[700] : '#f4f3f4'}
            />
          </View>
        </ScrollView>

        {/* Submit button */}
        <View style={styles.footer}>
          <Button
            title="Đăng bài"
            onPress={handlePost}
            loading={isPosting}
            size="lg"
            icon={!isPosting ? <Ionicons name="send" size={16} color="#fff" /> : undefined}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Modal>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
    backgroundColor: Surface.white,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Ink[700],
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  forumRow: {
    flexGrow: 0,
    marginBottom: Spacing.xs,
  },
  forumChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Surface.border,
    backgroundColor: Surface.white,
    marginRight: Spacing.sm,
  },
  forumChipActive: {
    backgroundColor: Brand[700],
    borderColor: Brand[700],
  },
  forumChipText: {
    fontSize: FontSize.sm,
    color: Ink[500],
  },
  forumChipTextActive: {
    color: '#FFFFFF',
    fontWeight: FontWeight.medium,
  },
  input: {
    backgroundColor: Surface.white,
    borderWidth: 1,
    borderColor: Surface.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: FontSize.base,
    color: Ink[900],
    marginBottom: Spacing.xs,
  },
  inputError: {
    borderColor: Semantic.error,
  },
  contentInput: {
    minHeight: 120,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Semantic.error,
    marginBottom: Spacing.sm,
  },
  anonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  anonLabel: {
    flex: 1,
    fontSize: FontSize.base,
    color: Ink[700],
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
    backgroundColor: Surface.white,
  },
});
