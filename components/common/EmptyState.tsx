import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ink, Surface, FontSize, Spacing } from '../../constants/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = 'file-tray-outline',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={Ink[300]} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Ink[700],
    marginTop: Spacing.base,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  action: {
    marginTop: Spacing.lg,
  },
});
