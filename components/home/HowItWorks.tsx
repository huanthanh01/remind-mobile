/**
 * "How it works" – 3-step journey section.
 * Maps to web .home-how-it-works.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

const STEPS = [
  {
    number: '01',
    icon: 'sparkles-outline' as const,
    title: 'Sơ cứu cùng AI',
    desc: 'Trò chuyện ẩn danh với AI Therapist để giải tỏa áp lực tức thời và nhận các bài tập tâm lý cơ bản.',
  },
  {
    number: '02',
    icon: 'people-outline' as const,
    title: 'Chia sẻ cộng đồng',
    desc: 'Tham gia Góc Tâm Sự để đọc những câu chuyện tương tự và nhận lời khuyên từ cộng đồng.',
  },
  {
    number: '03',
    icon: 'calendar-outline' as const,
    title: 'Đặt lịch chuyên gia',
    desc: 'Kết nối nhanh chóng với các chuyên gia tâm lý đã được kiểm duyệt khi cần hỗ trợ chuyên sâu.',
  },
];

export default function HowItWorks() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hành trình chữa lành cùng ReMind</Text>
      <Text style={styles.subheading}>
        Quy trình 3 bước đơn giản giúp bạn lấy lại sự cân bằng trong cuộc sống.
      </Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => (
          <View key={step.number} style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>{step.number}</Text>
              <View style={styles.stepIconCircle}>
                <Ionicons name={step.icon} size={22} color={Brand[700]} />
              </View>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <View style={styles.connector}>
                <Ionicons name="chevron-down" size={16} color={Brand[300]} />
              </View>
            )}
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
  steps: {
    gap: Spacing.base,
  },
  stepCard: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepNumber: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Brand[100],
  },
  stepIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Brand['050'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
    marginBottom: Spacing.sm,
  },
  stepDesc: {
    fontSize: FontSize.sm,
    color: Ink[500],
    lineHeight: 20,
  },
  connector: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
