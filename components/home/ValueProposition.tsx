import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, CalmBlue, Ink, Surface, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

const VALUES = [
  {
    icon: 'chatbubble-ellipses-outline' as const,
    iconColor: Brand[700],
    bg: Brand['050'],
    title: 'AI Chat 24/7',
    desc: 'Sơ cứu tâm lý, lời khuyên khoa học, hoàn toàn miễn phí.',
  },
  {
    icon: 'lock-closed-outline' as const,
    iconColor: CalmBlue[600],
    bg: CalmBlue['050'],
    title: 'Ẩn danh tuyệt đối',
    desc: 'Bảo mật 100%, tự do chia sẻ tại Góc tâm sự.',
  },
  {
    icon: 'medkit-outline' as const,
    iconColor: Brand[600],
    bg: Brand[100],
    title: 'Chuyên gia uy tín',
    desc: 'Kết nối bác sĩ, chuyên gia tâm lý đã kiểm duyệt.',
  },
];

export default function ValueProposition() {
  return (
    <View style={styles.container}>
      {/* Title with subtle divider line */}
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Giá trị cốt lõi</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.list}>
        {VALUES.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.itemRow,
              index < VALUES.length - 1 && styles.borderBottom,
            ]}
          >
            <View style={[styles.colorBlock, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    backgroundColor: Surface.canvas,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  heading: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Surface.border,
  },
  list: {
    gap: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
  },
  colorBlock: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginBottom: 3,
  },
  itemDesc: {
    fontSize: FontSize.xs + 0.5,
    color: Ink[500],
    lineHeight: 18,
  },
});
