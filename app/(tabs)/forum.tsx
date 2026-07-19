/**
 * Forum tab screen – post list with search, category filtering, and pagination.
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
  Modal,
  ScrollView,
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
import { SkeletonPostCard } from '../../components/common/SkeletonLoader';
import type { PostType, ForumType } from '../../stores/types';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

export default function ForumScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [forums, setForums] = useState<ForumType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PostType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [filterForumId, setFilterForumId] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const fetchPosts = async (page: number, replace = true, forumId = filterForumId) => {
    try {
      setLoading(true);
      const res = await ForumService.getPosts(page, 10, forumId);
      setPosts(res.posts);
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const [forumMap, setForumMap] = useState<Record<string, string>>({});

  // Initial load posts & forums
  useEffect(() => {
    fetchPosts(1, true);
    ForumService.getForums().then((data) => {
      setForums(data);
      const map: Record<string, string> = {};
      data.forEach((f) => {
        map[f._id] = f.title;
      });
      setForumMap(map);
    }).catch(() => {});
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
    await fetchPosts(currentPage, true, filterForumId);
    setRefreshing(false);
  }, [currentPage, filterForumId]);

  const handlePostPress = (postId: string) => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }
    router.push(`/forum/${postId}` as any);
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }
    setShowCreateModal(true);
  };

  const applyFilter = (forumId: string) => {
    setFilterForumId(forumId);
    setShowFilterModal(false);
    fetchPosts(1, true, forumId);
  };

  const displayPosts = searchTerm.trim() ? searchResults : posts;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Góc Tâm Sự</Text>
        <Text style={styles.headerSubtitle}>
          Chia sẻ và lắng nghe cùng cộng đồng
        </Text>
      </View>

      {/* Search & Filter bar row */}
      <View style={styles.searchRow}>
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
        
        <TouchableOpacity
          style={[styles.filterBtn, !!filterForumId && styles.filterBtnActive]}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="funnel-outline" size={20} color={filterForumId ? Brand[700] : Ink[600]} />
        </TouchableOpacity>
      </View>

      {/* Post list / loading state */}
      {loading ? (
        <ScrollView style={{ paddingHorizontal: Spacing.xl, paddingTop: Spacing.md }}>
          <SkeletonPostCard />
          <SkeletonPostCard />
          <SkeletonPostCard />
        </ScrollView>
      ) : (
        <>
          <FlatList
            data={displayPosts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <PostCard
                post={{
                  ...item,
                  forumName: (item.forumId && forumMap[item.forumId]) || item.forumName || '',
                }}
                onPress={handlePostPress}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Brand[700]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="chatbubble-ellipses-outline"
                title={searchTerm ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}
                description={searchTerm ? 'Thử tìm kiếm từ khóa khác' : 'Hãy là người đầu tiên chia sẻ!'}
              />
            }
            ListFooterComponent={
              (!searchTerm.trim() && totalPages > 1) ? (
                <View style={styles.paginationBar}>
                  <TouchableOpacity
                    style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                    disabled={currentPage === 1}
                    onPress={() => fetchPosts(currentPage - 1, true, filterForumId)}
                  >
                    <Ionicons name="chevron-back" size={18} color={currentPage === 1 ? Ink[300] : Ink[700]} />
                  </TouchableOpacity>
                  
                  <Text style={styles.pageIndicator}>
                    Trang {currentPage} / {totalPages}
                  </Text>

                  <TouchableOpacity
                    style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                    disabled={currentPage === totalPages}
                    onPress={() => fetchPosts(currentPage + 1, true, filterForumId)}
                  >
                    <Ionicons name="chevron-forward" size={18} color={currentPage === totalPages ? Ink[300] : Ink[700]} />
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        </>
      )}

      {/* FAB – Create post */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Filter Modal sheet */}
      <Modal visible={showFilterModal} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.filterContent}>
            <Text style={styles.filterTitle}>Lọc theo Diễn đàn</Text>
            <ScrollView style={styles.filterScroll} contentContainerStyle={{ gap: Spacing.sm }}>
              <TouchableOpacity
                style={[styles.filterOption, !filterForumId && styles.filterOptionActive]}
                onPress={() => applyFilter('')}
              >
                <Text style={[styles.filterOptionText, !filterForumId && styles.filterOptionTextActive]}>
                  Tất cả diễn đàn
                </Text>
                {!filterForumId && <Ionicons name="checkmark" size={18} color={Brand[700]} />}
              </TouchableOpacity>
              {forums.map((f) => (
                <TouchableOpacity
                  key={f._id}
                  style={[styles.filterOption, filterForumId === f._id && styles.filterOptionActive]}
                  onPress={() => applyFilter(f._id)}
                >
                  <Text style={[styles.filterOptionText, filterForumId === f._id && styles.filterOptionTextActive]}>
                    {f.title}
                  </Text>
                  {filterForumId === f._id && <Ionicons name="checkmark" size={18} color={Brand[700]} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
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
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Brand['050'],
    borderWidth: 1,
    borderColor: Brand[100],
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  createBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 9,
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
  filterBtn: {
    flex: 1,
    height: 44,
    backgroundColor: Surface.white,
    borderWidth: 1,
    borderColor: Surface.border,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: Brand['050'],
    borderColor: Brand[200],
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 180, // Extra padding at bottom to clear the lower FAB
  },
  fab: {
    position: 'absolute',
    bottom: 104, // Snug position just above floating tab bar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  paginationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
    backgroundColor: 'transparent',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Surface.border,
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageIndicator: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Ink[700],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  filterContent: {
    backgroundColor: Surface.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    maxHeight: '60%',
  },
  filterTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginBottom: Spacing.md,
  },
  filterScroll: {
    flexGrow: 0,
    marginBottom: Spacing.md,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.lg,
    backgroundColor: Surface.muted,
  },
  filterOptionActive: {
    backgroundColor: Brand['050'],
    borderWidth: 1,
    borderColor: Brand[100],
  },
  filterOptionText: {
    fontSize: FontSize.sm,
    color: Ink[700],
  },
  filterOptionTextActive: {
    color: Brand[700],
    fontWeight: FontWeight.semibold,
  },
});
