/**
 * Register screen.
 */

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth.store';
import RegisterForm from '../../components/auth/RegisterForm';
import { Surface } from '../../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const handleRegister = async (data: {
    fullName: string;
    email: string;
    password: string;
    role: 'student' | 'expert';
  }) => {
    setIsLoading(true);
    setGlobalError('');
    try {
      await register(data.fullName, data.email, data.password, data.role);
      Alert.alert('Thành công', `Chào mừng ${data.fullName}!`);
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
        <RegisterForm
          onSubmit={handleRegister}
          onSwitchToLogin={() => router.push('/(auth)/login')}
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
