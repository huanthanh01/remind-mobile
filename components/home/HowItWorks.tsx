import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brand, Ink, Surface, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';

const STEPS = [
  {
    num: '01',
    title: 'Sơ cứu cùng AI',
    desc: 'Trò chuyện với AI Therapist để giải tỏa áp lực tức thì.',
  },
  {
    num: '02',
    title: 'Chia sẻ cộng đồng',
    desc: 'Góc tâm sự ẩn danh, nhận đồng cảm từ bạn bè cùng tần số.',
  },
  {
    num: '03',
    title: 'Đặt lịch chuyên gia',
    desc: 'Kết nối bác sĩ tâm lý đã được kiểm duyệt khi cần hỗ trợ sâu.',
  },
];

export default function HowItWorks() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>3 bước sơ cứu tâm lý</Text>

      <View style={styles.timeline}>
        {/* Continuous vertical connecting line */}
        <View style={styles.verticalLine} />

        {STEPS.map((step) => (
          <View key={step.num} style={styles.stepRow}>
            <View style={styles.badgeCircle}>
              <Text style={styles.badgeText}>{step.num}</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.desc}>{step.desc}</Text>
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
    paddingVertical: Spacing['2xl'],
    backgroundColor: Surface.canvas, // Light canvas background (#F7FAF9)
  },
  heading: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginBottom: Spacing.xl,
    letterSpacing: 0,
  },
  timeline: {
    position: 'relative',
    gap: Spacing.xl,
  },
  verticalLine: {
    position: 'absolute',
    left: 19,
    top: 20,
    bottom: 20,
    width: 1.5,
    backgroundColor: Brand[300], // Teal connecting line
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
  },
  badgeCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Brand[700],
    backgroundColor: Brand[700], // Primary brand teal circle (#176B68)
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontSize: FontSize.base + 1,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginBottom: 4,
  },
  desc: {
    fontSize: FontSize.xs + 0.5,
    color: Ink[700],
    lineHeight: 20,
  },
});
