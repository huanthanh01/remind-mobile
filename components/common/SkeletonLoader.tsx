import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Surface, Radius } from '../../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = Radius.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E0E7E5',
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonPostCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Skeleton width={36} height={36} borderRadius={18} />
        <View style={styles.headerInfo}>
          <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
          <Skeleton width={60} height={10} />
        </View>
      </View>

      <Skeleton width="90%" height={18} style={{ marginBottom: 10 }} />
      <Skeleton width="100%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width="95%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width="40%" height={12} style={{ marginBottom: 16 }} />

      <View style={styles.footer}>
        <Skeleton width={50} height={14} />
        <Skeleton width={50} height={14} style={{ marginLeft: 16 }} />
        <Skeleton width={80} height={14} style={{ marginLeft: 'auto' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
  },
});
