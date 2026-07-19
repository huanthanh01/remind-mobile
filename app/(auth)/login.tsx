/**
 * Login screen.
 */

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => router.push('/(auth)/register')}
          onForgotPassword={() => {
            // TODO: implement forgot password screen
          }}
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
  },
  flex: {
    flex: 1,
  },
});
