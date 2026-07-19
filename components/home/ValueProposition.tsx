/**
 * Value proposition section – 3 cards showing core features.
 * Maps to web .home-values section.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, CalmBlue, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

const VALUES = [
  {
    icon: 'chatbubbles-outline' as const,
    iconBg: '#EEF2FF',
    iconColor: '#6366F1',
    title: 'AI Chat 24/7',
    desc: 'Sơ cứu tâm lý tức thời vào bất kể khung giờ nào. Hoàn toàn miễn phí, đưa ra lời khuyên khoa học và bài tập thư giãn.',
  },
  {
    icon: 'lock-closed-outline' as const,
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    title: 'Ẩn danh tuyệt đối',
    desc: 'Hệ thống bảo mật băm dữ liệu và phân quyền chặt chẽ. Bạn thoải mái chia sẻ ở Diễn đàn với bộ lọc từ khóa văn minh.',
  },
  {
    icon: 'medkit-outline' as const,
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    title: 'Chuyên gia thấu hiểu',
    desc: 'Đội ngũ bác sĩ thật được kiểm định bằng cấp kỹ càng. AI sẽ tóm tắt trước lịch sử cảm xúc giúp giảm thời gian chẩn đoán.',
  },
];

export default function ValueProposition() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        An toàn hơn — Tiết kiệm hơn — Thấu hiểu hơn
      </Text>
      <Text style={styles.subheading}>
        Hệ sinh thái thông minh giúp bạn gạt bỏ hoàn toàn rào cản e ngại khi đi
        chăm sóc sức khỏe tinh thần.
      </Text>

      <View style={styles.grid}>
        {VALUES.map((item) => (
          <View key={item.title} style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={24} color={item.iconColor} />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
    backgroundColor: Surface.muted,
  },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subheading: {
    fontSize: FontSize.sm,
    color: Ink[500],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  grid: {
    gap: Spacing.base,
  },
  card: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
    marginBottom: Spacing.sm,
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: Ink[500],
    lineHeight: 20,
  },
});
