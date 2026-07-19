/**
 * Shared segmented toggle: AI <-> Chuyên gia.
 * Used in both the AI-chat tab header and GroupChat headers so users can
 * switch between anonymous AI chat and expert group chat from either view.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, FontSize, FontWeight, Radius, Shadow } from '../../constants/theme';

interface Props {
  value: 'ai' | 'expert';
  onChange: (v: 'ai' | 'expert') => void;
}

export default function ChatModeToggle({ value, onChange }: Props) {
  return (
    <View style={styles.segment}>
      <ToggleBtn active={value === 'ai'} onPress={() => onChange('ai')} icon="sparkles" label="AI" />
      <ToggleBtn active={value === 'expert'} onPress={() => onChange('expert')} icon="people-outline" label="Chuyên gia" />
    </View>
  );
}

function ToggleBtn({ active, onPress, icon, label }: { active: boolean; onPress: () => void; icon: any; label: string }) {
  return (
    <TouchableOpacity style={[styles.btn, active && styles.btnActive]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={16} color={active ? '#fff' : Ink[600]} />
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: Surface.muted,
    borderRadius: Radius.full,
    padding: 4,
    gap: 4,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  btnActive: { backgroundColor: Brand[700], ...Shadow.sm },
  text: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Ink[600] },
  textActive: { color: '#fff' },
});
