/**
 * AuthModal – Modal prompt requesting login/registration for guest users.
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Brand, Ink, Surface, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import Button from './Button';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthModal({
  visible,
  onClose,
  title = 'Yêu cầu Đăng nhập',
  message = 'Tính năng AI Chat 24/7 chỉ dành cho thành viên ReMind. Vui lòng đăng nhập để bắt đầu trò chuyện ẩn danh.',
}: AuthModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/(auth)/login');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.card}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={Ink[500]} />
          </TouchableOpacity>

          {/* Icon Header */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="brain" size={32} color={Brand[700]} />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Đăng nhập / Đăng ký"
              onPress={handleLogin}
              variant="primary"
              size="lg"
            />
            <Button
              title="Để sau"
              onPress={onClose}
              variant="ghost"
              size="md"
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    ...Shadow.lg,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Brand['050'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: FontSize.sm,
    color: Ink[500],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 8,
  },
});
