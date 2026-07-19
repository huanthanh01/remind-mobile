/**
 * Home tab screen – scrollable landing page.
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../stores/auth.store';
import HeroSection from '../../components/home/HeroSection';
import ValueProposition from '../../components/home/ValueProposition';
import HowItWorks from '../../components/home/HowItWorks';
import ExpertsPreview from '../../components/home/ExpertsPreview';
import Footer from '../../components/home/Footer';
import { Surface } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleOpenAIChat = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    router.push('/(tabs)/ai-chat');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
  },
});
