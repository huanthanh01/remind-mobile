import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Brand, CalmBlue, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

/**
 * 3 Real Experts seeded in Database (see remind-backend/scripts/seedExperts.ts):
 * 1. TS. Nguyễn Thị Nga - Bác sĩ Tâm lý lâm sàng
 * 2. ThS. Lê Văn Minh - Tư vấn viên Tâm lý
 * 3. Dr. Phạm Thu Linh - Nhà trị liệu LGBTQ+
 * 
 * Styled strictly according to DESIGN.md palette (Teal & Soft Blue, 8px radii).
 */
const DB_EXPERTS = [
  {
    id: '1',
    initials: 'NN',
    name: 'TS. Nguyễn Thị Nga',
    title: 'Tâm lý học lâm sàng',
    tags: ['Trầm cảm', 'Rối loạn lo âu'],
    accentColor: Brand[700],
    avatarBg: Brand['050'],
    tagBg: Brand[100],
    tagText: Brand[700],
  },
  {
    id: '2',
    initials: 'LM',
    name: 'ThS. Lê Văn Minh',
    title: 'Tư vấn viên Tâm lý',
    tags: ['Stress công việc', 'Mối quan hệ'],
    accentColor: CalmBlue[600],
    avatarBg: CalmBlue['050'],
    tagBg: CalmBlue[100],
    tagText: CalmBlue[600],
  },
  {
    id: '3',
    initials: 'PL',
    name: 'Dr. Phạm Thu Linh',
    title: 'Nhà trị liệu LGBTQ+',
    tags: ['LGBTQ+', 'Lo âu'],
    accentColor: Brand[600],
    avatarBg: Brand['050'],
    tagBg: Brand[100],
    tagText: Brand[600],
  },
];

interface ExpertsPreviewProps {
  onViewAll: () => void;
}

export default function ExpertsPreview({ onViewAll }: ExpertsPreviewProps) {
  return (
    <View style={styles.container}>
      {/* Header with Title and "Xem tất cả →" link */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Đội ngũ chuyên gia</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllLink}>Xem tất cả →</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel of Expert Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      >
        {DB_EXPERTS.map((expert) => (
          <View key={expert.id} style={styles.card}>
            {/* Top accent bar line */}
            <View style={[styles.topBar, { backgroundColor: expert.accentColor }]} />

            <View style={styles.cardContent}>
              <View style={[styles.avatar, { backgroundColor: expert.avatarBg }]}>
                <Text style={[styles.avatarText, { color: expert.accentColor }]}>
                  {expert.initials}
                </Text>
              </View>

              <Text style={styles.expertName}>{expert.name}</Text>
              <Text style={styles.expertTitle}>{expert.title}</Text>

              <View style={styles.tagsRow}>
                {expert.tags.map((tag) => (
                  <View key={tag} style={[styles.tagBadge, { backgroundColor: expert.tagBg }]}>
                    <Text style={[styles.tagText, { color: expert.tagText }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xl,
    backgroundColor: Surface.canvas,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  heading: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Ink[900],
    letterSpacing: 0,
  },
  viewAllLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
  carouselContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    width: 240,
    backgroundColor: Surface.white,
    borderRadius: Radius.md, // 8px radius per DESIGN.md shape lock
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Surface.border,
    ...Shadow.sm,
  },
  topBar: {
    height: 3,
    width: '100%',
  },
  cardContent: {
    padding: Spacing.base,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.md, // 8px radius for expert images per DESIGN.md
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  expertName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginBottom: 2,
  },
  expertTitle: {
    fontSize: FontSize.xs + 0.5,
    color: Ink[500],
    marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.md, // 8px radius per DESIGN.md chip rules
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
