/**
 * Login form component.
 * Ported from web Login.tsx – email/password only (no Google login for mobile yet).
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Semantic, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import Input from '../common/Input';
import Button from '../common/Button';

interface LoginFormProps {
  onSubmit: (identifier: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
  isLoading: boolean;
  globalError?: string;
}

export default function LoginForm({
  onSubmit,
  onSwitchToRegister,
  onForgotPassword,
  isLoading,
  globalError,
}: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!identifier.trim()) newErrors.identifier = 'Email không được để trống';
    if (!password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải dài ít nhất 6 ký tự';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await onSubmit(identifier, password);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Brand header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandIcon}>
          <Ionicons name="leaf" size={28} color="#fff" />
        </View>
        <Text style={styles.brandName}>ReMind</Text>
        <Text style={styles.brandTagline}>Nền tảng hỗ trợ tâm lý</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Chào mừng trở lại</Text>
        <Text style={styles.subtitle}>
          Đăng nhập vào tài khoản của bạn để tiếp tục
        </Text>

        {globalError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color={Semantic.error} />
            <Text style={styles.errorBannerText}>{globalError}</Text>
          </View>
        )}

        <Input
          placeholder="Email"
          iconName="mail-outline"
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: '' }));
          }}
          error={errors.identifier}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Input
          placeholder="Mật khẩu"
          iconName="lock-closed-outline"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={errors.password}
          secureTextEntry={!showPassword}
          rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
          onRightIconPress={() => setShowPassword(!showPassword)}
        />

        {onForgotPassword && (
          <TouchableOpacity onPress={onForgotPassword} style={styles.forgotLink}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        )}

        <Button
          title="Đăng nhập"
          onPress={handleSubmit}
          loading={isLoading}
          size="lg"
          icon={!isLoading ? <Ionicons name="log-in-outline" size={18} color="#fff" /> : undefined}
          style={styles.loginBtn}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={onSwitchToRegister}>
            <Text style={styles.switchLink}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing['2xl'],
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  brandIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  brandName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Brand[700],
  },
  brandTagline: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginTop: Spacing.xs,
  },
  formContainer: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginBottom: Spacing.xl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Semantic.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(160,71,71,0.2)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  errorBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Semantic.error,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.base,
  },
  forgotText: {
    fontSize: FontSize.sm,
    color: Brand[700],
    fontWeight: FontWeight.medium,
  },
  loginBtn: {
    marginTop: Spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  switchText: {
    fontSize: FontSize.sm,
    color: Ink[500],
  },
  switchLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
});
