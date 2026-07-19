/**
 * ForgetPasswordForm component.
 * Ported from web ForgetPassword.tsx – 3-step OTP flow:
 * Step 1: Input registered email to request OTP
 * Step 2: Input 6-digit OTP code received via email
 * Step 3: Input & confirm new password
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Brand,
  Ink,
  Surface,
  Semantic,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  Shadow,
} from '../../constants/theme';
import Input from '../common/Input';
import Button from '../common/Button';
import { AuthService } from '../../services/auth.service';

interface ForgetPasswordFormProps {
  onBackToLogin: () => void;
  onGoBack?: () => void;
}

export default function ForgetPasswordForm({
  onBackToLogin,
  onGoBack,
}: ForgetPasswordFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await AuthService.forgotPassword(email.trim());
      setSuccessMsg('Mã OTP đã được gửi thành công đến email của bạn.');
      setStep(2);
      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi OTP. Vui lòng kiểm tra lại email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await AuthService.forgotPassword(email.trim());
      setSuccessMsg('Mã OTP đã được gửi lại thành công.');
      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi lại OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6 || isNaN(Number(cleanOtp))) {
      setErrorMsg('Mã OTP phải gồm 6 chữ số.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải dài ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await AuthService.resetPassword(email.trim(), otp.trim(), newPassword);
      Alert.alert(
        'Thành công',
        'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.',
        [{ text: 'Đăng nhập ngay', onPress: onBackToLogin }]
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
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

      {/* Main Card */}
      <View style={styles.formContainer}>
        {/* Step Indicator */}
        <View style={styles.stepIndicatorContainer}>
          <View style={[styles.stepBadge, step >= 1 && styles.stepBadgeActive]}>
            <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>1</Text>
          </View>
          <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
          <View style={[styles.stepBadge, step >= 2 && styles.stepBadgeActive]}>
            <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>2</Text>
          </View>
          <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
          <View style={[styles.stepBadge, step >= 3 && styles.stepBadgeActive]}>
            <Text style={[styles.stepText, step >= 3 && styles.stepTextActive]}>3</Text>
          </View>
        </View>

        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>
          {step === 1 && 'Nhập email đã đăng ký để nhận mã OTP khôi phục mật khẩu'}
          {step === 2 && `Mã xác thực OTP đã được gửi đến: ${email}`}
          {step === 3 && 'Thiết lập mật khẩu mới cho tài khoản của bạn'}
        </Text>

        {/* Message Banners */}
        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={Semantic.error} />
            <Text style={styles.errorBannerText}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={18} color={Semantic.success} />
            <Text style={styles.successBannerText}>{successMsg}</Text>
          </View>
        ) : null}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <View style={styles.stepForm}>
            <Input
              placeholder="Địa chỉ Email"
              iconName="mail-outline"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMsg) setErrorMsg('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />

            <Button
              title="Gửi mã OTP"
              onPress={handleSendOtp}
              loading={isLoading}
              size="lg"
              icon={!isLoading ? <Ionicons name="send-outline" size={18} color="#fff" /> : undefined}
              style={styles.actionBtn}
            />
          </View>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <View style={styles.stepForm}>
            <Input
              placeholder="Mã OTP gồm 6 chữ số"
              iconName="key-outline"
              value={otp}
              onChangeText={(text) => {
                setOtp(text.slice(0, 6));
                if (errorMsg) setErrorMsg('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              editable={!isLoading}
            />

            <View style={styles.resendRow}>
              {countdown > 0 ? (
                <Text style={styles.countdownText}>
                  Gửi lại mã sau <Text style={styles.countdownHighlight}>{countdown}s</Text>
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resendLink}>Gửi lại mã OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              title="Xác thực OTP"
              onPress={handleVerifyOtp}
              loading={isLoading}
              size="lg"
              icon={!isLoading ? <Ionicons name="checkmark-done-outline" size={18} color="#fff" /> : undefined}
              style={styles.actionBtn}
            />

            <TouchableOpacity
              style={styles.changeEmailBtn}
              onPress={() => {
                setStep(1);
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              <Text style={styles.changeEmailText}>Đổi địa chỉ email</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <View style={styles.stepForm}>
            <Input
              placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
              iconName="lock-closed-outline"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errorMsg) setErrorMsg('');
              }}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              editable={!isLoading}
            />

            <Input
              placeholder="Xác nhận mật khẩu mới"
              iconName="shield-checkmark-outline"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errorMsg) setErrorMsg('');
              }}
              secureTextEntry={!showConfirmPassword}
              rightIcon={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              editable={!isLoading}
            />

            <Button
              title="Cập nhật mật khẩu"
              onPress={handleResetPassword}
              loading={isLoading}
              size="lg"
              icon={!isLoading ? <Ionicons name="save-outline" size={18} color="#fff" /> : undefined}
              style={styles.actionBtn}
            />
          </View>
        )}

        {/* Bottom Switch Link */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Nhớ lại mật khẩu? </Text>
          <TouchableOpacity onPress={onBackToLogin}>
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
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Surface.canvas,
    borderWidth: 1.5,
    borderColor: Ink[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeActive: {
    backgroundColor: Brand[700],
    borderColor: Brand[700],
  },
  stepText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Ink[600],
  },
  stepTextActive: {
    color: '#ffffff',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Surface.border,
    marginHorizontal: Spacing.xs,
  },
  stepLineActive: {
    backgroundColor: Brand[700],
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
    lineHeight: 20,
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Semantic.successBg,
    borderWidth: 1,
    borderColor: 'rgba(46,125,50,0.2)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  successBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Semantic.success,
  },
  stepForm: {
    gap: Spacing.xs,
  },
  resendRow: {
    alignItems: 'flex-end',
    marginBottom: Spacing.base,
    marginTop: -Spacing.xs,
  },
  countdownText: {
    fontSize: FontSize.xs,
    color: Ink[500],
  },
  countdownHighlight: {
    fontWeight: FontWeight.bold,
    color: Brand[700],
  },
  resendLink: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
  actionBtn: {
    marginTop: Spacing.xs,
  },
  changeEmailBtn: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  changeEmailText: {
    fontSize: FontSize.xs,
    color: Ink[500],
    textDecorationLine: 'underline',
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
