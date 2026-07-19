/**
 * Suggestion chips for quick AI chat prompts.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

const SUGGESTIONS = [
  { icon: 'sad-outline' as const, text: 'Tớ đang buồn' },
  { icon: 'alert-circle-outline' as const, text: 'Tớ bị áp lực' },
  { icon: 'help-circle-outline' as const, text: 'Tớ cần lời khuyên' },
  { icon: 'leaf-outline' as const, text: 'Bài tập thở' },
];

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SUGGESTIONS.map((item) => (
        <TouchableOpacity
          key={item.text}
          style={styles.chip}
          onPress={() => onSelect(item.text)}
          activeOpacity={0.7}
        >
          <Ionicons name={item.icon} size={16} color={Brand[700]} />
          <Text style={styles.chipText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Brand['050'],
    borderWidth: 1,
    borderColor: Brand[100],
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Brand[700],
  },
});
