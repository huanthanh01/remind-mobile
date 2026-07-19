import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Brand, Ink, CalmBlue, Semantic, Radius, FontSize, Spacing } from '../../constants/theme';

type BadgeVariant = 'brand' | 'blue' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const colorMap: Record<BadgeVariant, { bg: string; text: string }> = {
  brand: { bg: Brand['050'], text: Brand[700] },
  blue: { bg: CalmBlue['050'], text: CalmBlue[600] },
  success: { bg: Semantic.successBg, text: Semantic.success },
  warning: { bg: Semantic.warningBg, text: Semantic.warning },
  error: { bg: Semantic.errorBg, text: Semantic.error },
  neutral: { bg: '#F0F0F0', text: Ink[700] },
};

export default function Badge({ text, variant = 'brand', style }: BadgeProps) {
  const colors = colorMap[variant];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
});
