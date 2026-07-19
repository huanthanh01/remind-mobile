/**
 * AI Chat tab screen.
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth.store';
import { AIService } from '../../services/ai.service';
import ChatBubble from '../../components/ai-chat/ChatBubble';
import ChatInput from '../../components/ai-chat/ChatInput';
import SuggestionChips from '../../components/ai-chat/SuggestionChips';
import TypingIndicator from '../../components/ai-chat/TypingIndicator';
import WelcomeBanner from '../../components/ai-chat/WelcomeBanner';
import type { AIChatMessage } from '../../stores/types';
import { Brand, Ink, Surface, Spacing, FontSize, FontWeight } from '../../constants/theme';

const INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: 1,
    sender: 'bot',
    text: 'Chào bạn! Tớ là ReMind AI — trợ lý sức khỏe tinh thần của bạn. 💚\n\nTớ ở đây để lắng nghe và hỗ trợ bạn. Mọi cuộc trò chuyện đều hoàn toàn ẩn danh và riêng tư.',
    time: '09:00',
  },
  {
    id: 2,
    sender: 'bot',
    text: 'Hôm nay bạn cảm thấy thế nào? Cứ chia sẻ thoải mái nhé — không ai biết bạn là ai đâu.',
    time: '09:00',
  },
];

export default function AIChatScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Keyboard visibility listener to adjust bottom offsets dynamically
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const now = new Date();
    const timeStr =
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0');

    const userMsg: AIChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: timeStr,
    };

    // Prepare history before state update
    const history = messages
      .filter((m) => m.id !== 1 && m.id !== 2) // Exclude hardcoded initial messages from history
      .map((m) => ({
        role: m.sender === 'bot' ? 'ai' : 'user',
        text: m.text,
      }));

    const botMsgId = Date.now() + 1;
    const initialBotMsg: AIChatMessage = {
      id: botMsgId,
      sender: 'bot',
      text: '',
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg, initialBotMsg]);
    setInputValue('');
    setShowBanner(false);
    scrollToBottom();

    // Show typing indicator
    setIsTyping(true);

    try {
      await AIService.sendMessageStream(
        text.trim(),
        history,
        (chunkText) => {
          setIsTyping(false); // Hide typing indicator when first chunk arrives
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId ? { ...m, text: m.text + chunkText } : m
            )
          );
        },
        () => {
          setIsTyping(false);
          scrollToBottom();
        },
        (error) => {
          setIsTyping(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text: m.text || 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau nhé. 🙏',
                  }
                : m
            )
          );
          scrollToBottom();
        }
      );
    } catch (error) {
      setIsTyping(false);
    }
  };

  const handleSend = () => sendMessage(inputValue);
  const handleSuggestion = (text: string) => sendMessage(text);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header bar to prevent messages from sticking to the top */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trợ lý AI ReMind</Text>
        <Text style={styles.headerSubtitle}>Trò chuyện ẩn danh và chia sẻ tâm tư 24/7</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            showBanner ? <WelcomeBanner onDismiss={() => setShowBanner(false)} /> : null
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToBottom}
        />

        {/* Suggestion chips (only show if few messages) */}
        {messages.length <= 3 && (
          <SuggestionChips onSelect={handleSuggestion} />
        )}

        <ChatInput
          value={inputValue}
          onChangeText={setInputValue}
          onSend={handleSend}
          disabled={isTyping}
          isKeyboardVisible={isKeyboardVisible}
        />
      </KeyboardAvoidingView>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Surface.white,
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Ink[500],
    marginTop: 2,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
  },
});
