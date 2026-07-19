import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Brand, Ink, Surface, FontSize, Spacing } from '../../constants/theme';

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Brand[700]} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  text: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    color: Ink[500],
  },
});
