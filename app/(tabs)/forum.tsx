/**
 * Forum tab screen – post list with search, create, pagination.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../stores/auth.store';
import { ForumService } from '../../services/forum.service';
import PostCard from '../../components/forum/PostCard';
import CreatePostModal from '../../components/forum/CreatePostModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import AuthModal from '../../components/common/AuthModal';
import type { PostType } from '../../stores/types';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

export default function ForumScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PostType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const fetchPosts = async (page: number, replace = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await ForumService.getPosts(page, 10);
      if (replace) {
        setPosts(res.posts);
      } else {
        setPosts((prev) => [...prev, ...res.posts]);
      }
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await ForumService.searchPosts(searchTerm);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(1, true);
    setRefreshing(false);
  }, []);

  const onEndReached = () => {
    if (!loadingMore && currentPage < totalPages && !searchTerm.trim()) {
      fetchPosts(currentPage + 1);
    }
  };

  const handlePostPress = (postId: string) => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }
    router.push(`/forum/${postId}`);
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }
    setShowCreateModal(true);
  };

  const displayPosts = searchTerm.trim() ? searchResults : posts;

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải bài viết..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Góc Tâm Sự</Text>
        <Text style={styles.headerSubtitle}>
          Chia sẻ và lắng nghe cùng cộng đồng
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Ink[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bài viết..."
            placeholderTextColor={Ink[400]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={18} color={Ink[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Post list */}
      <FlatList
        data={displayPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={handlePostPress} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Brand[700]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title={searchTerm ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}
            description={searchTerm ? 'Thử tìm kiếm từ khóa khác' : 'Hãy là người đầu tiên chia sẻ!'}
          />
        }
        ListFooterComponent={
          loadingMore ? <LoadingSpinner text="Đang tải thêm..." /> : null
        }
      />

      {/* FAB – Create post */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Create post modal */}
      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={() => fetchPosts(1, true)}
      />

      {/* Auth Modal for guest */}
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginTop: Spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Surface.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Surface.border,
    height: 44,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Ink[900],
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
});
