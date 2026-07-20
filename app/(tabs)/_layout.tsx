/**
 * Tab layout – 5 tabs: Home, Forum, AI Chat, Experts, Profile.
 * Custom Floating Pill Navbar with space-evenly item distribution, intuitive icons, and micro labels.
 */

import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Brand, Ink, Surface } from '../../constants/theme';
import { useAuth } from '../../stores/auth.store';
import AuthModal from '../../components/common/AuthModal';

/**
 * Clean, distinct icons per feature tab:
 * 1. Home -> home-outline / home
 * 2. Forum -> newspaper-outline / newspaper (Diễn đàn / Tin tức cộng đồng)
 * 3. AI Chat -> hardware-chip-outline / hardware-chip (AI Assistant Chip)
 * 4. Experts -> briefcase-outline / briefcase (Chuyên gia / Bác sĩ)
 * 5. Profile -> person-outline / person (Tài khoản)
 */
const TAB_CONFIG: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  index: { icon: 'home-outline', activeIcon: 'home', label: 'Trang chủ' },
  forum: { icon: 'people-outline', activeIcon: 'people', label: 'Diễn đàn' },
  'ai-chat': { icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', label: 'AI Chat' },
  experts: { icon: 'medkit', activeIcon: 'medkit', label: 'Chuyên gia' },
  profile: { icon: 'person-outline', activeIcon: 'person', label: 'Tài khoản' },
};

function CustomTabBar({
  state,
  descriptors,
  navigation,
  onRequireAuth,
}: BottomTabBarProps & { onRequireAuth: () => void }) {
  const { isAuthenticated } = useAuth();

  return (
    <View style={styles.floatingBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        if ((options as any).href === null) return null;

        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name] || {
          icon: 'help-circle-outline',
          activeIcon: 'help-circle',
          label: route.name,
        };

        const onPress = () => {
          // If guest clicks AI Chat -> Prompt Auth Modal
          if (route.name === 'ai-chat' && !isAuthenticated) {
            onRequireAuth();
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isFocused ? config.activeIcon : config.icon}
                size={24}
                color={isFocused ? Brand[700] : Ink[400]}
              />
              <View style={[styles.activeDot, { opacity: isFocused ? 1 : 0 }]} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const { currentUser } = useAuth();
  const isExpert = currentUser?.role === 'expert';

  return (
    <>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar {...props} onRequireAuth={() => setAuthModalVisible(true)} />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Trang chủ' }} />
        <Tabs.Screen name="forum" options={{ title: 'Diễn đàn' }} />
        <Tabs.Screen 
          name="ai-chat" 
          options={{ 
            title: 'AI Chat',
            href: isExpert ? null : undefined,
          }} 
        />
        <Tabs.Screen name="experts" options={{ title: 'Chuyên gia' }} />
        <Tabs.Screen name="profile" options={{ title: 'Tài khoản' }} />
      </Tabs>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        title="Tính năng dành cho thành viên"
        message="Trợ lý AI Chat 24/7 chỉ dành riêng cho người dùng đã đăng nhập. Vui lòng đăng nhập hoặc tạo tài khoản để sử dụng."
      />
    </>
  );
}

const styles = StyleSheet.create({
  floatingBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 20,
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    backgroundColor: Surface.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: Surface.border,
    elevation: 14,
    shadowColor: Brand[700],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Brand[700],
    marginTop: 4,
  },
});
