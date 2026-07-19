/**
 * Welcome banner shown at the top of AI chat.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

interface WelcomeBannerProps {
  onDismiss: () => void;
}

export default function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
        <Ionicons name="close" size={16} color={Brand[700]} />
      </TouchableOpacity>
      <View style={styles.iconCircle}>
        <Ionicons name="shield-checkmark" size={24} color={Brand[700]} />
      </View>
      <Text style={styles.title}>Không gian an toàn của bạn</Text>
      <Text style={styles.description}>
        Mọi cuộc trò chuyện đều hoàn toàn ẩn danh và riêng tư. AI Therapist luôn sẵn sàng lắng nghe bạn 24/7. 💚
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.md,
    backgroundColor: Brand['050'],
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Brand[100],
  },
  closeBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Brand[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.sm,
    color: Ink[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
