/**
 * Footer section – brand, links, copyright.
 * Maps to web .home-footer.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

export default function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoLetter}>R</Text>
          </View>
          <Text style={styles.logoText}>ReMind</Text>
        </View>
        <Text style={styles.tagline}>
          Nền tảng hỗ trợ sức khỏe tinh thần ẩn danh cho Gen Z.
        </Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.copyright}>
        © 2026 ReMind — SDN302 Group 1. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['3xl'] + 60,
    backgroundColor: Ink[900],
  },
  brand: {
    marginBottom: Spacing.lg,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.md,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: Spacing.base,
  },
  copyright: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
});
