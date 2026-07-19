/**
 * Register form component.
 * Ported from web Register component.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Semantic, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';
import Input from '../common/Input';
import Button from '../common/Button';

interface RegisterFormProps {
  onSubmit: (data: {
    fullName: string;
    email: string;
    password: string;
    role: 'student' | 'expert';
  }) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  globalError?: string;
}

export default function RegisterForm({
  onSubmit,
  onSwitchToLogin,
  isLoading,
  globalError,
}: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'expert'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Họ và tên không được để trống';
    if (!email.trim()) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ';
    if (!password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải dài ít nhất 6 ký tự';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await onSubmit({ fullName, email, password, role });
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
        <Text style={styles.brandTagline}>Tạo tài khoản mới</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>
          Tạo tài khoản để bắt đầu hành trình chữa lành
        </Text>

        {globalError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color={Semantic.error} />
            <Text style={styles.errorBannerText}>{globalError}</Text>
          </View>
        )}

        <Input
          placeholder="Họ và tên"
          iconName="person-outline"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
          }}
          error={errors.fullName}
          autoCapitalize="words"
        />

        <Input
          placeholder="Email"
          iconName="mail-outline"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
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

        <Input
          placeholder="Xác nhận mật khẩu"
          iconName="lock-closed-outline"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }}
          error={errors.confirmPassword}
          secureTextEntry={!showPassword}
        />

        {/* Role selector */}
        <Text style={styles.roleLabel}>Bạn là:</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
            onPress={() => setRole('student')}
          >
            <Ionicons
              name="school-outline"
              size={18}
              color={role === 'student' ? '#fff' : Ink[500]}
            />
            <Text style={[styles.roleBtnText, role === 'student' && styles.roleBtnTextActive]}>
              Sinh viên
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'expert' && styles.roleBtnActive]}
            onPress={() => setRole('expert')}
          >
            <Ionicons
              name="medical-outline"
              size={18}
              color={role === 'expert' ? '#fff' : Ink[500]}
            />
            <Text style={[styles.roleBtnText, role === 'expert' && styles.roleBtnTextActive]}>
              Chuyên gia
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Đăng ký"
          onPress={handleSubmit}
          loading={isLoading}
          size="lg"
          icon={!isLoading ? <Ionicons name="person-add-outline" size={18} color="#fff" /> : undefined}
          style={styles.submitBtn}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.switchLink}>Đăng nhập</Text>
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
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['2xl'],
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
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
  roleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Ink[700],
    marginBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Surface.border,
    backgroundColor: Surface.white,
  },
  roleBtnActive: {
    backgroundColor: Brand[700],
    borderColor: Brand[700],
  },
  roleBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Ink[500],
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
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
