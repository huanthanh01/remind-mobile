/**
 * Experts preview section – 3 sample expert cards.
 * Maps to web .home-experts-preview.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const MOCK_EXPERTS = [
  {
    id: '1',
    name: 'ThS. BS. Nguyễn Văn A',
    title: 'Chuyên gia Tâm lý học Lâm sàng',
    tags: ['Trầm cảm', 'Rối loạn lo âu'],
  },
  {
    id: '2',
    name: 'ThS. Trần Thị B',
    title: 'Cố vấn Tâm lý Học đường',
    tags: ['Áp lực đồng lứa', 'Định hướng'],
  },
  {
    id: '3',
    name: 'BS. Lê Hoàng C',
    title: 'Chuyên gia Trị liệu Gia đình',
    tags: ['Mâu thuẫn', 'Giao tiếp'],
  },
];

interface ExpertsPreviewProps {
  onViewAll: () => void;
}

export default function ExpertsPreview({ onViewAll }: ExpertsPreviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Đội ngũ chuyên gia hàng đầu</Text>
      <Text style={styles.subheading}>
        Các bác sĩ, thạc sĩ tâm lý học với nhiều năm kinh nghiệm luôn sẵn sàng
        đồng hành cùng bạn.
      </Text>

      <View style={styles.grid}>
        {MOCK_EXPERTS.map((expert) => (
          <View key={expert.id} style={styles.card}>
            <Avatar name={expert.name} size={48} />
            <View style={styles.info}>
              <Text style={styles.expertName}>{expert.name}</Text>
              <Text style={styles.expertTitle}>{expert.title}</Text>
              <View style={styles.tags}>
                {expert.tags.map((tag) => (
                  <Badge key={tag} text={tag} variant="brand" />
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.viewAllBtn} onPress={onViewAll}>
        <Text style={styles.viewAllText}>Xem tất cả chuyên gia</Text>
        <Ionicons name="arrow-forward" size={16} color={Brand[700]} />
      </TouchableOpacity>
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
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  info: {
    flex: 1,
  },
  expertName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
  },
  expertTitle: {
    fontSize: FontSize.xs,
    color: Ink[500],
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Brand[100],
    borderRadius: Radius.lg,
    backgroundColor: Brand['050'],
  },
  viewAllText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
});
