/**
 * Forgot password screen.
 */

import React from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import ForgetPasswordForm from '../../components/auth/ForgetPasswordForm';
import { Surface } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ForgetPasswordForm
          onBackToLogin={() => router.replace('/(auth)/login')}
          onGoBack={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(auth)/login');
            }
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : Platform.OS === 'web' ? 24 : 12,
  },
  flex: {
    flex: 1,
  },
});
