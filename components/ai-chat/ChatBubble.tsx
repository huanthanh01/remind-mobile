/**
 * Chat bubble for AI chat messages.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize } from '../../constants/theme';
import type { AIChatMessage } from '../../stores/types';

interface ChatBubbleProps {
  message: AIChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message.sender === 'bot';

  return (
    <View style={[styles.row, isBot ? styles.rowBot : styles.rowUser]}>
      {isBot && (
        <View style={styles.botAvatar}>
          <Ionicons name="sparkles" size={16} color="#fff" />
        </View>
      )}
      <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
        <Text style={[styles.text, isBot ? styles.textBot : styles.textUser]}>
          {message.text}
        </Text>
        <Text style={[styles.time, isBot ? styles.timeBot : styles.timeUser]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  rowBot: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  bubbleBot: {
    backgroundColor: Brand['050'],
    borderTopLeftRadius: Radius.sm,
  },
  bubbleUser: {
    backgroundColor: Brand[700],
    borderTopRightRadius: Radius.sm,
  },
  text: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  textBot: {
    color: Ink[700],
  },
  textUser: {
    color: '#FFFFFF',
  },
  time: {
    fontSize: 10,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  timeBot: {
    color: Ink[400],
  },
  timeUser: {
    color: 'rgba(255,255,255,0.7)',
  },
});
