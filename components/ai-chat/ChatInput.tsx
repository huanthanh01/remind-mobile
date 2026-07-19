/**
 * Chat input bar with send button.
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize } from '../../constants/theme';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({ value, onChangeText, onSend, disabled }: ChatInputProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tâm sự của bạn..."
        placeholderTextColor={Ink[400]}
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={2000}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={!canSend}
      >
        <Ionicons name="send" size={18} color={canSend ? '#fff' : Ink[400]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Surface.white,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Surface.muted,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: FontSize.sm,
    color: Ink[900],
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Surface.muted,
  },
});
