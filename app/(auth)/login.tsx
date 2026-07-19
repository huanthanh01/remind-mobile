/**
 * Login screen.
 */

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth.store';
import LoginForm from '../../components/auth/LoginForm';
import { Surface } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const handleLogin = async (identifier: string, password: string) => {
    setIsLoading(true);
    setGlobalError('');
    try {
      await login(identifier, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setGlobalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => router.push('/(auth)/register')}
          onForgotPassword={() => {
            router.push('/(auth)/forgot-password' as any);
          }}
          onGoBack={() => router.replace('/(tabs)')}
          isLoading={isLoading}
          globalError={globalError}
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
