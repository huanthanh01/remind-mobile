/**
 * Hero section – maps to web .home-hero
 * "Áp lực này, để ReMind gánh cùng bạn."
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';
import Button from '../common/Button';

interface HeroSectionProps {
  onOpenAIChat: () => void;
  onOpenExpertDirectory: () => void;
}

export default function HeroSection({ onOpenAIChat, onOpenExpertDirectory }: HeroSectionProps) {
  return (
    <View style={styles.container}>
      {/* Badge */}
      <View style={styles.badge}>
        <Ionicons name="star" size={14} color={Brand[500]} />
        <Text style={styles.badgeText}>
          Nền tảng hỗ trợ tâm lý ẩn danh 24/7 cho Gen Z
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Áp lực này, để{' '}
        <Text style={styles.highlight}>ReMind</Text>
        {' '}gánh cùng bạn.
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        Không gian hoàn toàn ẩn danh để bạn giải tỏa gánh nặng tinh thần. Sơ cứu
        tâm lý miễn phí với Trợ lý AI và kết nối Chuyên gia khi bạn cần can thiệp
        sâu.
      </Text>

      {/* CTA Buttons */}
      <View style={styles.actions}>
        <Button
          title="Trò chuyện với AI (Miễn phí)"
          onPress={onOpenAIChat}
          variant="primary"
          size="lg"
          icon={<Ionicons name="chatbubbles" size={18} color="#fff" />}
        />
        <Button
          title="Tìm chuyên gia phù hợp"
          onPress={onOpenExpertDirectory}
          variant="secondary"
          size="lg"
          icon={<Ionicons name="search" size={18} color={Brand[700]} />}
        />
      </View>

      {/* Mini chatbot preview card */}
      <View style={styles.chatPreview}>
        <View style={styles.chatHeader}>
          <View style={styles.chatAvatar}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.chatName}>AI Therapist</Text>
            <View style={styles.chatStatusRow}>
              <View style={styles.chatStatusDot} />
              <Text style={styles.chatStatus}>Đang hoạt động • Luôn ẩn danh</Text>
            </View>
          </View>
        </View>

        <View style={styles.chatMessages}>
          <View style={styles.botMsg}>
            <Text style={styles.botMsgText}>
              Chào bạn, tôi ở đây để lắng nghe. Hôm nay của bạn thế nào?
            </Text>
          </View>
          <View style={styles.userMsg}>
            <Text style={styles.userMsgText}>
              Tôi vừa trượt bài kiểm tra, áp lực quá...
            </Text>
          </View>
          <View style={styles.botMsg}>
            <Text style={styles.botMsgText}>
              Tôi hiểu cảm giác đó. Hãy cùng thực hiện bài tập thở 4-7-8 nhé? 💚
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Brand['050'],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Brand[700],
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Ink[900],
    lineHeight: 38,
    marginBottom: Spacing.base,
  },
  highlight: {
    color: Brand[700],
  },
  description: {
    fontSize: FontSize.base,
    color: Ink[500],
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  /* Chat preview card */
  chatPreview: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
  },
  chatStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  chatStatus: {
    fontSize: FontSize.xs,
    color: Ink[500],
  },
  chatMessages: {
    gap: Spacing.sm,
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: Brand['050'],
    borderRadius: Radius.lg,
    borderTopLeftRadius: Radius.sm,
    padding: Spacing.md,
    maxWidth: '85%',
  },
  botMsgText: {
    fontSize: FontSize.sm,
    color: Ink[700],
    lineHeight: 20,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: Brand[700],
    borderRadius: Radius.lg,
    borderTopRightRadius: Radius.sm,
    padding: Spacing.md,
    maxWidth: '85%',
  },
  userMsgText: {
    fontSize: FontSize.sm,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});
