/**
 * Home tab screen – scrollable landing page.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../stores/auth.store';
import HeroSection from '../../components/home/HeroSection';
import ValueProposition from '../../components/home/ValueProposition';
import HowItWorks from '../../components/home/HowItWorks';
import ExpertsPreview from '../../components/home/ExpertsPreview';
import Footer from '../../components/home/Footer';
import AuthModal from '../../components/common/AuthModal';
import { Surface } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleOpenAIChat = () => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }
    router.push('/(tabs)/ai-chat');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection
          onOpenAIChat={handleOpenAIChat}
          onOpenExpertDirectory={() => router.push('/(tabs)/experts')}
        />
        <ValueProposition />
        <HowItWorks />
        <ExpertsPreview onViewAll={() => router.push('/(tabs)/experts')} />
        <Footer />
      </ScrollView>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        title="Tính năng dành cho thành viên"
        message="Trợ lý AI Chat 24/7 chỉ dành riêng cho người dùng đã đăng nhập. Vui lòng đăng nhập hoặc tạo tài khoản để sử dụng."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
});
