import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setLoading(true);
    // Simulate API request delay for forgot password
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Ink[700]} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={36} color={Brand[700]} />
          </View>
          <Text style={styles.title}>Quên mật khẩu?</Text>
          <Text style={styles.subtitle}>
            Nhập email tài khoản của bạn để nhận liên kết khôi phục mật khẩu.
          </Text>
        </View>

        {!submitted ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email tài khoản</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={Ink[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="nhap@email.com"
                  placeholderTextColor={Ink[400]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <Button
              title="Gửi liên kết khôi phục"
              onPress={handleSubmit}
              loading={loading}
              size="lg"
              variant="primary"
            />
          </View>
        ) : (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.successTitle}>Đã gửi email khôi phục!</Text>
            <Text style={styles.successDesc}>
              Chúng tôi đã gửi hướng dẫn lấy lại mật khẩu tới email <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Vui lòng kiểm tra hộp thư của bạn.
            </Text>
            <Button
              title="Quay lại Đăng nhập"
              onPress={() => router.replace('/(auth)/login')}
              size="lg"
              variant="primary"
              style={{ marginTop: Spacing.lg, width: '100%' }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Surface.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Surface.border,
    marginBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Brand['050'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Brand[100],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Ink[500],
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  form: {
    gap: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Ink[700],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Surface.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Surface.border,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  inputIcon: {
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Ink[900],
  },
  successBox: {
    alignItems: 'center',
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Surface.border,
    ...Shadow.sm,
  },
  successTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginTop: Spacing.md,
  },
  successDesc: {
    fontSize: FontSize.sm,
    color: Ink[600],
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
});
