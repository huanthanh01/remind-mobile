/**
 * Profile tab – placeholder for Phase 1, full implementation in Phase 2.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../stores/auth.store';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="person-circle-outline" size={80} color={Ink[300]} />
          <Text style={styles.notLoggedInTitle}>Chưa đăng nhập</Text>
          <Text style={styles.notLoggedInDesc}>
            Đăng nhập để xem và quản lý hồ sơ cá nhân
          </Text>
          <Button
            title="Đăng nhập"
            onPress={() => router.push('/(auth)/login')}
            size="lg"
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Profile header */}
        <View style={styles.profileCard}>
          <Avatar
            name={currentUser.fullName}
            uri={currentUser.avatar}
            size={72}
          />
          <Text style={styles.name}>{currentUser.fullName || 'Người dùng'}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {currentUser.role === 'expert' ? 'Chuyên gia' : 
               currentUser.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
            </Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={20} color={Ink[500]} />
            <Text style={styles.menuText}>Chỉnh sửa hồ sơ</Text>
            <Ionicons name="chevron-forward" size={18} color={Ink[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={20} color={Ink[500]} />
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
            <Ionicons name="chevron-forward" size={18} color={Ink[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={20} color={Ink[500]} />
            <Text style={styles.menuText}>Thông báo</Text>
            <Ionicons name="chevron-forward" size={18} color={Ink[400]} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <Button
          title="Đăng xuất"
          onPress={handleLogout}
          variant="outline"
          size="lg"
          icon={<Ionicons name="log-out-outline" size={18} color={Ink[700]} />}
          style={styles.logoutBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  notLoggedIn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    gap: Spacing.base,
  },
  notLoggedInTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Ink[700],
  },
  notLoggedInDesc: {
    fontSize: FontSize.sm,
    color: Ink[500],
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Surface.border,
    marginBottom: Spacing.xl,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    marginTop: Spacing.md,
  },
  email: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginTop: Spacing.xs,
  },
  roleBadge: {
    marginTop: Spacing.md,
    backgroundColor: Brand['050'],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  roleBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Brand[700],
  },
  menu: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Surface.border,
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
  },
  menuText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Ink[700],
  },
  logoutBtn: {
    marginTop: 'auto',
  },
});
