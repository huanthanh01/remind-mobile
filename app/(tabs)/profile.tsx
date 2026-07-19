/**
 * Profile tab – Premium UI/UX redesigned screen.
 * Dynamic layout catering to Student, Expert, and Admin roles.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../stores/auth.store';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow, Semantic, CalmBlue } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(tabs)');
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notLoggedIn}>
          <View style={styles.notLoggedInIconWrapper}>
            <Ionicons name="person-circle-outline" size={100} color={Brand[200]} />
            <View style={styles.notLoggedInIconBadge}>
              <Ionicons name="lock-closed" size={20} color={Brand[700]} />
            </View>
          </View>
          <Text style={styles.notLoggedInTitle}>Chào mừng bạn đến với ReMind</Text>
          <Text style={styles.notLoggedInDesc}>
            Hãy đăng nhập tài khoản của bạn để khám phá đầy đủ tính năng tư vấn, diễn đàn và hỗ trợ AI tuyệt vời.
          </Text>
          <Button
            title="Đăng nhập ngay"
            onPress={() => router.push('/(auth)/login')}
            size="lg"
            style={styles.loginBtn}
          />
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.registerLink}>
            <Text style={styles.registerLinkText}>Chưa có tài khoản? Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderRoleBadge = (role: string) => {
    let badgeBg: string = CalmBlue['050'];
    let badgeColor: string = CalmBlue[600];
    let label = 'Sinh viên';
    let iconName: keyof typeof Ionicons.glyphMap = 'school';

    if (role === 'expert') {
      badgeBg = Brand['050'];
      badgeColor = Brand[700];
      label = 'Chuyên gia';
      iconName = 'checkmark-done-circle';
    } else if (role === 'admin' || role === 'system_manager') {
      badgeBg = Semantic.errorBg;
      badgeColor = Semantic.error;
      label = 'Quản trị viên';
      iconName = 'shield-checkmark';
    }

    return (
      <View style={[styles.roleBadge, { backgroundColor: badgeBg }]}>
        <Ionicons name={iconName} size={14} color={badgeColor} style={styles.roleIcon} />
        <Text style={[styles.roleBadgeText, { color: badgeColor }]}>{label}</Text>
      </View>
    );
  };

  const renderStats = () => {
    let stat1 = { value: '0', label: 'Lịch hẹn' };
    let stat2 = { value: 'Hoạt động', label: 'Trạng thái' };
    let stat3 = { value: '0đ', label: 'Ví tích lũy' };

    if (currentUser.role === 'admin' || currentUser.role === 'system_manager') {
      stat1 = { value: '99+', label: 'Yêu cầu duyệt' };
      stat2 = { value: 'Hoạt động', label: 'Trạng thái' };
      stat3 = { value: 'Hệ thống', label: 'Phân quyền' };
    } else if (currentUser.role === 'expert') {
      stat1 = { value: '18', label: 'Lịch tư vấn' };
      stat2 = { value: '4.9 ★', label: 'Đánh giá' };
      stat3 = { value: '1.2M đ', label: 'Thu nhập' };
    } else {
      stat1 = { value: '4', label: 'Lịch tư vấn' };
      stat2 = { value: '2', label: 'Bài viết' };
      stat3 = { value: '150k đ', label: 'Số dư ví' };
    }

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stat1.value}</Text>
          <Text style={styles.statLabel}>{stat1.label}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stat2.value}</Text>
          <Text style={styles.statLabel}>{stat2.label}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stat3.value}</Text>
          <Text style={styles.statLabel}>{stat3.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cover Backdrop decoration */}
      <View style={styles.coverContainer}>
        <View style={styles.coverBlob1} />
        <View style={styles.coverBlob2} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          {/* Profile Card overlapping the cover */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Avatar
                name={currentUser.fullName}
                uri={currentUser.avatar}
                size={84}
              />
              {(currentUser.role === 'admin' || currentUser.role === 'system_manager') && (
                <View style={styles.crownBadge}>
                  <Ionicons name="ribbon" size={12} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={styles.name}>{currentUser.fullName || 'Người dùng ReMind'}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>
            
            {renderRoleBadge(currentUser.role)}

            <View style={styles.cardDivider} />

            {renderStats()}
          </View>

          {/* Section 1: Tài khoản & Bảo mật */}
          <Text style={styles.sectionTitle}>TÀI KHOẢN & BẢO MẬT</Text>
          <View style={styles.menuGroup}>
            <MenuItem 
              icon="person-outline" 
              iconBg={CalmBlue[600]} 
              title="Chỉnh sửa hồ sơ" 
              subtitle="Cập nhật thông tin cá nhân của bạn"
            />
            <MenuItem 
              icon="lock-closed-outline" 
              iconBg="#10B981" 
              title="Đổi mật khẩu" 
              subtitle="Thay đổi mật khẩu bảo mật tài khoản"
            />
            <MenuItem 
              icon="notifications-outline" 
              iconBg="#F59E0B" 
              title="Thông báo" 
              subtitle="Cấu hình nhận thông báo hệ thống"
              isLast={true}
            />
          </View>

          {/* Section 2: Chức năng riêng biệt tùy role */}
          {currentUser.role === 'admin' || currentUser.role === 'system_manager' ? (
            <>
              <Text style={styles.sectionTitle}>QUẢN TRỊ HỆ THỐNG</Text>
              <View style={styles.menuGroup}>
                <MenuItem 
                  icon="people-outline" 
                  iconBg="#6366F1" 
                  title="Quản lý người dùng" 
                  subtitle="Xem danh sách sinh viên & chuyên gia"
                />
                <MenuItem 
                  icon="ribbon-outline" 
                  iconBg="#10B981" 
                  title="Phê duyệt chuyên gia" 
                  subtitle="Duyệt hồ sơ đăng ký của chuyên gia"
                />
                <MenuItem 
                  icon="analytics-outline" 
                  iconBg="#EC4899" 
                  title="Báo cáo & Thống kê" 
                  subtitle="Xem báo cáo hoạt động và doanh thu"
                />
                <MenuItem 
                  icon="settings-outline" 
                  iconBg={Ink[600]} 
                  title="Cài đặt hệ thống" 
                  subtitle="Cấu hình các tham số hệ thống"
                  isLast={true}
                />
              </View>
            </>
          ) : currentUser.role === 'expert' ? (
            <>
              <Text style={styles.sectionTitle}>TÍNH NĂNG CHUYÊN GIA</Text>
              <View style={styles.menuGroup}>
                <MenuItem 
                  icon="calendar-outline" 
                  iconBg={Brand[700]} 
                  title="Quản lý lịch hẹn" 
                  subtitle="Xem và xếp lịch tư vấn với sinh viên"
                />
                <MenuItem 
                  icon="chatbubble-ellipses-outline" 
                  iconBg={CalmBlue[600]} 
                  title="Tin nhắn hỗ trợ" 
                  subtitle="Trò chuyện và giải đáp thắc mắc"
                />
                <MenuItem 
                  icon="wallet-outline" 
                  iconBg="#059669" 
                  title="Thống kê thu nhập" 
                  subtitle="Quản lý thu nhập từ các cuộc tư vấn"
                  isLast={true}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>TIỆN ÍCH CỦA TÔI</Text>
              <View style={styles.menuGroup}>
                <MenuItem 
                  icon="calendar-outline" 
                  iconBg={Brand[700]} 
                  title="Lịch tư vấn của tôi" 
                  subtitle="Xem các lịch hẹn đã đặt với chuyên gia"
                />
                <MenuItem 
                  icon="document-text-outline" 
                  iconBg="#8B5CF6" 
                  title="Bài viết đã đăng" 
                  subtitle="Quản lý bài viết của bạn trên diễn đàn"
                />
                <MenuItem 
                  icon="wallet-outline" 
                  iconBg="#059669" 
                  title="Ví điện tử ReMind" 
                  subtitle="Nạp tiền & thanh toán lịch hẹn nhanh"
                  isLast={true}
                />
              </View>
            </>
          )}

          {/* Section 3: Hỗ trợ & Khác */}
          <Text style={styles.sectionTitle}>HỖ TRỢ & HỆ THỐNG</Text>
          <View style={styles.menuGroup}>
            <MenuItem 
              icon="help-circle-outline" 
              iconBg="#6B7280" 
              title="Trung tâm trợ giúp" 
              subtitle="Giải đáp câu hỏi và hướng dẫn sử dụng"
            />
            <MenuItem 
              icon="shield-checkmark-outline" 
              iconBg="#9CA3AF" 
              title="Điều khoản & Chính sách" 
              subtitle="Quy chế hoạt động và bảo mật thông tin"
              isLast={true}
            />
          </View>

          {/* Logout Button */}
          <Button
            title="Đăng xuất tài khoản"
            onPress={handleLogout}
            variant="outline"
            size="lg"
            icon={<Ionicons name="log-out-outline" size={20} color={Semantic.error} />}
            style={styles.logoutBtn}
            textStyle={styles.logoutBtnText}
          />
        </View>
      </ScrollView>
    </View>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
}

function MenuItem({ icon, iconBg, title, subtitle, onPress, showChevron = true, isLast = false }: MenuItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} 
      onPress={onPress} 
      activeOpacity={0.6}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={16} color={Ink[300]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  coverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: Brand[700],
    overflow: 'hidden',
  },
  coverBlob1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  coverBlob2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100, // Shifts profile card into cover backdrop
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  profileCard: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Surface.border,
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -Spacing['3xl'] - 10,
    marginBottom: Spacing.sm,
    backgroundColor: Surface.white,
    borderRadius: 999,
    padding: 4,
    ...Shadow.sm,
  },
  crownBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Surface.white,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    textAlign: 'center',
  },
  email: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginTop: Spacing.xs,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  roleIcon: {
    marginRight: 4,
  },
  roleBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  cardDivider: {
    width: '100%',
    height: 1,
    backgroundColor: Surface.muted,
    marginVertical: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Brand[700],
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Ink[500],
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Surface.border,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Ink[500],
    letterSpacing: 1.1,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  menuGroup: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Surface.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Surface.muted,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
  },
  menuItemSubtitle: {
    fontSize: FontSize.xs,
    color: Ink[500],
    marginTop: 2,
  },
  logoutBtn: {
    borderColor: Semantic.error,
    borderWidth: 1.5,
    marginTop: Spacing.md,
    height: 52,
    borderRadius: Radius.lg,
  },
  logoutBtnText: {
    color: Semantic.error,
    fontWeight: FontWeight.bold,
  },
  notLoggedIn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    backgroundColor: Surface.canvas,
  },
  notLoggedInIconWrapper: {
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  notLoggedInIconBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Brand[100],
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Surface.canvas,
  },
  notLoggedInTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Ink[900],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  notLoggedInDesc: {
    fontSize: FontSize.base,
    color: Ink[500],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing['2xl'],
  },
  loginBtn: {
    width: '100%',
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Brand[700],
    ...Shadow.md,
  },
  registerLink: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  registerLinkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
});

