/**
 * Register form component.
 * Ported from web Register component.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  onGoBack?: () => void;
  isLoading: boolean;
  globalError?: string;
}

export default function RegisterForm({
  onSubmit,
  onSwitchToLogin,
  onGoBack,
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
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        {onGoBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={Ink[700]} />
            <Text style={styles.backBtnText}>Trang chủ</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Brand header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandIcon}>
          <MaterialCommunityIcons name="brain" size={34} color="#ffffff" />
        </View>
        <Text style={styles.brandName}>ReMind</Text>
        <Text style={styles.brandTagline}>Nền tảng hỗ trợ tâm lý</Text>
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

        {/* Role selector - placed at top of form, text-only */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Bạn là:</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
              onPress={() => setRole('student')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleBtnText, role === 'student' && styles.roleBtnTextActive]}>
                Sinh viên
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'expert' && styles.roleBtnActive]}
              onPress={() => setRole('expert')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleBtnText, role === 'expert' && styles.roleBtnTextActive]}>
                Chuyên gia
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  topBar: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Surface.white,
    borderWidth: 1,
    borderColor: Surface.border,
    alignSelf: 'flex-start',
    ...Shadow.sm,
  },
  backBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Ink[700],
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Brand[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  brandName: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Brand[700],
    letterSpacing: -0.5,
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
    marginBottom: Spacing.md,
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
  roleContainer: {
    marginBottom: Spacing.lg,
  },
  roleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Ink[700],
    marginBottom: Spacing.xs,
  },
  roleRow: {
    flexDirection: 'row',
    backgroundColor: Surface.canvas,
    borderRadius: Radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
  },
  roleBtnActive: {
    backgroundColor: Brand[700],
  },
  roleBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Ink[600],
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: FontWeight.semibold,
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
