/**
 * GroupChat component (mobile).
 * Ported from web Chat.tsx – expert/user 1:1 chat rooms over Socket.io.
 * Rooms list + message thread, mirrors API_CHATS endpoints.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Brand,
  Ink,
  Surface,
  Semantic,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  Shadow,
} from '../../constants/theme';
import { ChatService, ChatRoom, ChatMessage } from '../../services/chat.service';
import { useAuth } from '../../stores/auth.store';
import Avatar from '../common/Avatar';
import ChatModeToggle from './ChatModeToggle';
import ChatInput from '../ai-chat/ChatInput';

type ChatView = 'list' | 'thread';

export default function GroupChat({ mode = 'expert', onChange }: { mode?: 'ai' | 'expert'; onChange?: (v: 'ai' | 'expert') => void }) {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id || '';
  const insets = useSafeAreaInsets();

  const [view, setView] = useState<ChatView>('list');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const scrollToEnd = () => flatListRef.current?.scrollToEnd({ animated: true });

  // Load rooms
  useEffect(() => {
    ChatService.listRooms()
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  // Socket lifecycle
  useEffect(() => {
    let socket: any;
    let cancelled = false;
    ChatService.connectSocket().then((s) => {
      if (cancelled) {
        s.disconnect();
        return;
      }
      socket = s;
      socketRef.current = s;

      s.on('chat:message', (msg: ChatMessage) => {
        setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
        setRooms((prev) =>
          prev
            .map((r) => {
              if (r._id !== msg.chatRoomId) return r;
              const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
              const isMine = senderId === currentUserId;
              const isActive = activeRoom?._id === r._id;
              return {
                ...r,
                lastMessage: { text: msg.text, senderId, sentAt: msg.createdAt },
                updatedAt: msg.createdAt,
                unreadCount: !isMine && !isActive ? (r.unreadCount || 0) + 1 : r.unreadCount || 0,
              };
            })
            .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()),
        );
      });

      s.on('chat:error', (err: { message: string }) => {
        setErrorBanner(err.message);
        setTimeout(() => setErrorBanner(null), 5000);
      });
    });

    return () => {
      cancelled = true;
      if (socket) socket.disconnect();
    };
  }, [currentUserId]);

  // Open room: join + fetch history
  const openRoom = async (room: ChatRoom) => {
    setActiveRoom(room);
    setView('thread');
    setMessages([]);
    const socket = socketRef.current;
    if (socket) socket.emit('chat:join', { roomId: room._id });
    setRooms((prev) => prev.map((r) => (r._id === room._id ? { ...r, unreadCount: 0 } : r)));
    try {
      const res = await ChatService.listMessages(room._id);
      setMessages([...res.messages].reverse());
      setHasMore(res.hasNext || false);
      socket?.emit('chat:read', { roomId: room._id });
      scrollToEnd();
    } catch {
      /* ignore */
    }
  };

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text || !activeRoom || !socketRef.current) return;
    socketRef.current.emit('chat:message', { roomId: activeRoom._id, text, type: 'text' });
    setInputValue('');
    scrollToEnd();
  };

  const loadOlder = async () => {
    if (!activeRoom || !hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const oldest = messages[0]?._id;
      const res = await ChatService.listMessages(activeRoom._id, oldest);
      setMessages((prev) => [...[...res.messages].reverse(), ...prev]);
      setHasMore(res.hasNext || false);
    } catch {
      /* ignore */
    } finally {
      setLoadingMore(false);
    }
  };

  const partnerOf = (room: ChatRoom) => {
    const p = room.participants?.find((x) => x.userId?._id !== currentUserId);
    return p ? p.userId : null;
  };

  const formatTime = (s?: string) => {
    if (!s) return '';
    const d = new Date(s);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  /* ───── Room list ───── */
  if (view === 'list') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingTop: insets.top || Spacing.md }]}>
          <Text style={styles.title}>Tin nhắn</Text>
          {currentUser?.role !== 'expert' && (
            <ChatModeToggle value={mode} onChange={onChange || (() => {})} />
          )}
        </View>
        <FlatList
          data={rooms}
          keyExtractor={(r) => r._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có cuộc hội thoại nào.</Text>}
          renderItem={({ item }) => {
            const partner = partnerOf(item);
            const name = partner?.fullName || 'Người dùng';
            const unread = item.unreadCount || 0;
            return (
              <TouchableOpacity style={styles.roomItem} onPress={() => openRoom(item)} activeOpacity={0.8}>
                <Avatar name={name} size={48} />
                <View style={styles.roomInfo}>
                  <View style={styles.roomNameRow}>
                    <Text style={styles.roomName} numberOfLines={1}>{name}</Text>
                    <Text style={styles.roomTime}>{formatTime(item.lastMessage?.sentAt)}</Text>
                  </View>
                  <View style={styles.roomNameRow}>
                    <Text style={styles.roomLast} numberOfLines={1}>{item.lastMessage?.text || 'Chưa có tin nhắn'}</Text>
                    {unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{unread}</Text></View>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  /* ───── Thread ───── */
  const partner = partnerOf(activeRoom!);
  const partnerName = partner?.fullName || 'Người dùng';
  const partnerAvatar = partner?.avatarUrl;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.threadHeader, { paddingTop: (insets.top || Spacing.md) + Spacing.sm }]}>
        <TouchableOpacity onPress={() => setView('list')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Ink[700]} />
        </TouchableOpacity>
        {partnerAvatar ? (
          <Image source={{ uri: partnerAvatar }} style={styles.threadAvatar} />
        ) : (
          <Avatar name={partnerName} size={36} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.threadName}>{partnerName}</Text>
          <Text style={styles.threadRole}>{partner?.role === 'expert' ? 'Chuyên gia tâm lý' : 'Học viên'}</Text>
        </View>
      </View>

      {errorBanner && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={Semantic.error} />
          <Text style={styles.errorText}>{errorBanner}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(m) => m._id}
        contentContainerStyle={styles.msgContainer}
        onEndReachedThreshold={0}
        // ponytail: load older on scroll-to-top handled via ListHeaderComponent button
        ListHeaderComponent={
          hasMore ? (
            <TouchableOpacity onPress={loadOlder} style={styles.loadMore}>
              {loadingMore ? <ActivityIndicator size="small" color={Brand[700]} /> : <Text style={styles.loadMoreText}>Tải tin nhắn cũ hơn</Text>}
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => {
          const senderId = typeof item.senderId === 'object' ? item.senderId?._id : item.senderId;
          const isMe = senderId === currentUserId;
          return (
            <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>{item.text}</Text>
                <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeThem]}>
                  {formatTime(item.createdAt)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <ChatInput
        value={inputValue}
        onChangeText={setInputValue}
        onSend={sendMessage}
        disabled={false}
        isKeyboardVisible={isKeyboardVisible}
      />
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Surface.canvas },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md, gap: Spacing.md },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Ink[900] },
  listContainer: { paddingHorizontal: Spacing.md, paddingBottom: 72 },
  emptyText: { textAlign: 'center', color: Ink[400], marginTop: Spacing['2xl'] },
  // ponytail: room shown as a card, not a list line
  roomItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.xl, backgroundColor: Surface.white, borderWidth: 1, borderColor: Surface.border, marginBottom: Spacing.sm, ...Shadow.sm },
  roomInfo: { flex: 1 },
  roomNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roomName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Ink[900], flex: 1 },
  roomTime: { fontSize: FontSize.xs, color: Ink[400] },
  roomLast: { fontSize: FontSize.sm, color: Ink[500], flex: 1, marginTop: 2 },
  unreadBadge: { backgroundColor: Brand[700], borderRadius: Radius.full, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#fff', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  threadHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderColor: Surface.border, backgroundColor: Surface.white },
  backBtn: { padding: 4 },
  threadAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Brand[100] },
  threadName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Ink[900] },
  threadRole: { fontSize: FontSize.xs, color: Ink[500] },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Semantic.errorBg, borderWidth: 1, borderColor: 'rgba(160,71,71,0.2)', margin: Spacing.md, padding: Spacing.sm, borderRadius: Radius.md },
  errorText: { flex: 1, fontSize: FontSize.sm, color: Semantic.error },
  msgContainer: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 72 },
  msgRow: { flexDirection: 'row', maxWidth: '80%' },
  msgRowMe: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  msgRowThem: { alignSelf: 'flex-start' },
  bubble: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.lg, maxWidth: '100%' },
  bubbleMe: { backgroundColor: Brand[700], borderTopRightRadius: Radius.sm },
  bubbleThem: { backgroundColor: Brand['050'], borderTopLeftRadius: Radius.sm },
  bubbleText: { fontSize: FontSize.sm, lineHeight: 20 },
  bubbleTextMe: { color: '#fff' },
  bubbleTextThem: { color: Ink[700] },
  bubbleTime: { fontSize: 10, marginTop: Spacing.xs, alignSelf: 'flex-end' },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.7)' },
  bubbleTimeThem: { color: Ink[400] },
  loadMore: { alignItems: 'center', paddingVertical: Spacing.sm },
  loadMoreText: { fontSize: FontSize.xs, color: Brand[700] },
});
