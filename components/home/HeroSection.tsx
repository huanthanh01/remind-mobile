import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Semantic, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';

interface HeroSectionProps {
  onOpenAIChat: () => void;
  onOpenExpertDirectory: () => void;
}

const FULL_TEXT = 'Chào bạn, tôi luôn ở đây để lắng nghe. Hôm nay của bạn thế nào? Hãy chia sẻ điều bạn đang trăn trở cùng tôi nhé!';

export default function HeroSection({ onOpenAIChat, onOpenExpertDirectory }: HeroSectionProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isTyping) {
      if (displayText.length < FULL_TEXT.length) {
        timer = setTimeout(() => {
          setDisplayText(FULL_TEXT.slice(0, displayText.length + 1));
        }, 55);
      } else {
        timer = setTimeout(() => setIsTyping(false), 3000);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(FULL_TEXT.slice(0, displayText.length - 1));
        }, 25);
      } else {
        timer = setTimeout(() => setIsTyping(true), 600);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isTyping]);

  return (
    <View style={styles.container}>
      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Sơ cứu tâm lý ẩn danh 24/7</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Áp lực này, để <Text style={styles.highlight}>ReMind</Text> gánh cùng bạn
      </Text>

      {/* Short Description */}
      <Text style={styles.description}>
        Giải tỏa gánh nặng tinh thần cùng AI Therapist hoặc kết nối chuyên gia khi bạn cần.
      </Text>

      {/* CTA Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onOpenAIChat}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Trò chuyện với AI miễn phí</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={onOpenExpertDirectory}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>Tìm chuyên gia phù hợp</Text>
        </TouchableOpacity>
      </View>

      {/* AI Therapist preview card (Soft Sage Card) */}
      <View style={styles.chatCard}>
        <View style={styles.chatHeader}>
          <View style={styles.chatAvatarContainer}>
            <View style={styles.chatAvatar}>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.chatAvatarDot} />
          </View>

          <View>
            <Text style={styles.chatName}>AI Therapist</Text>
            <Text style={styles.chatStatus}>Đang hoạt động · Luôn ẩn danh</Text>
          </View>
        </View>

        <View style={styles.msgBubble}>
          <Text style={styles.msgText}>
            {displayText}
            <Text style={styles.cursor}>|</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: Surface.canvas,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Brand['050'],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Ink[900],
    lineHeight: 36,
    marginBottom: Spacing.base,
    letterSpacing: 0,
  },
  highlight: {
    color: Brand[700],
  },
  description: {
    fontSize: FontSize.base,
    color: Ink[700],
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  primaryBtn: {
    height: 48,
    backgroundColor: Brand[700],
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  primaryBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: Surface.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Surface.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
  /* Calm Soft Teal AI Therapist Card */
  chatCard: {
    backgroundColor: Brand['050'],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Surface.border,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  chatAvatarContainer: {
    position: 'relative',
  },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: Radius.full, // Circle avatar per user request
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Semantic.success,
    borderWidth: 1.5,
    borderColor: Brand['050'],
  },
  chatName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  chatStatus: {
    fontSize: FontSize.xs,
    color: Ink[500],
    marginTop: 1,
  },
  msgBubble: {
    backgroundColor: Surface.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Surface.border,
    padding: Spacing.md,
  },
  msgText: {
    fontSize: FontSize.sm,
    color: Ink[900],
    lineHeight: 22,
    minHeight: 64, // Height reserved for multi-line text
  },
  cursor: {
    color: Brand[700],
    fontWeight: 'bold',
    fontSize: FontSize.md,
  },
});
