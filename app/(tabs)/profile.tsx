/**
 * Profile tab – Premium UI/UX redesigned screen.
 * Dynamic layout catering to Student, Expert, and Admin roles.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../stores/auth.store';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Brand, Ink, Surface, Spacing, Radius, FontSize, FontWeight, Shadow, Semantic, CalmBlue } from '../../constants/theme';
import { AuthService } from '../../services/auth.service';
import { AppointmentService, MobileAppointment } from '../../services/appointment.service';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout, refreshUser } = useAuth();

  // Modal Visibility States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);

  // Edit Profile Form States
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editInProgress, setEditInProgress] = useState(false);

  // Change Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordInProgress, setPasswordInProgress] = useState(false);

  // Appointments List States
  const [appointments, setAppointments] = useState<MobileAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Set default name when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullName || '');
    }
  }, [currentUser]);

  // Load appointments
  const loadAppointments = async () => {
    setLoadingAppointments(true);
    const list = await AppointmentService.getMyAppointments();
    setAppointments(list);
    setLoadingAppointments(false);
  };

  // Open Appointments Modal
  const handleOpenAppointments = () => {
    setShowAppointmentsModal(true);
    loadAppointments();
  };

  // Handle Edit Profile Save
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }
    setEditInProgress(true);
    try {
      await AuthService.updateProfile(editName.trim());
      await refreshUser(); // refresh user details in auth store
      Alert.alert('Thành công', 'Cập nhật thông tin cá nhân thành công!');
      setShowEditModal(false);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Cập nhật thông tin thất bại.');
    } finally {
      setEditInProgress(false);
    }
  };

  // Handle Change Password Save
  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin mật khẩu');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setPasswordInProgress(true);
    try {
      await AuthService.changePassword(currentPassword, newPassword);
      Alert.alert('Thành công', 'Đổi mật khẩu tài khoản thành công!');
      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setPasswordInProgress(false);
    }
  };

  // Handle Cancel Appointment
  const handleCancelAppointment = async (apptId: string) => {
    Alert.alert(
      'Hủy lịch hẹn',
      'Bạn có chắc chắn muốn hủy lịch tư vấn này không?',
      [
        { text: 'Bỏ qua', style: 'cancel' },
        {
          text: 'Đồng ý',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(apptId);
            try {
              await AppointmentService.cancelAppointment(apptId);
              Alert.alert('Thành công', 'Đã hủy lịch tư vấn thành công.');
              loadAppointments(); // Reload list
            } catch (err: any) {
              Alert.alert('Lỗi', err.response?.data?.error || 'Hủy lịch hẹn thất bại.');
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

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
              onPress={() => setShowEditModal(true)}
            />
            <MenuItem 
              icon="lock-closed-outline" 
              iconBg="#10B981" 
              title="Đổi mật khẩu" 
              subtitle="Thay đổi mật khẩu bảo mật tài khoản"
              onPress={() => setShowPasswordModal(true)}
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
                  onPress={handleOpenAppointments}
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

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdropClose} activeOpacity={1} onPress={() => setShowEditModal(false)} />
          <View style={styles.modalContainer}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa hồ sơ</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color={Ink[700]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Họ và tên của bạn</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Ink[400]} style={{ marginRight: Spacing.sm }} />
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Nhập họ và tên..."
                placeholderTextColor={Ink[400]}
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Hủy bỏ"
                variant="outline"
                onPress={() => setShowEditModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Lưu thay đổi"
                variant="primary"
                loading={editInProgress}
                onPress={handleSaveProfile}
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} transparent animationType="slide" onRequestClose={() => setShowPasswordModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdropClose} activeOpacity={1} onPress={() => setShowPasswordModal(false)} />
          <View style={styles.modalContainer}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color={Ink[700]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Ink[400]} style={{ marginRight: Spacing.sm }} />
              <TextInput
                style={styles.textInput}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại..."
                placeholderTextColor={Ink[400]}
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>Mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Ink[400]} style={{ marginRight: Spacing.sm }} />
              <TextInput
                style={styles.textInput}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                placeholderTextColor={Ink[400]}
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>Xác nhận mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Ink[400]} style={{ marginRight: Spacing.sm }} />
              <TextInput
                style={styles.textInput}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Xác nhận mật khẩu mới..."
                placeholderTextColor={Ink[400]}
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Hủy bỏ"
                variant="outline"
                onPress={() => setShowPasswordModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Đổi mật khẩu"
                variant="primary"
                loading={passwordInProgress}
                onPress={handleSavePassword}
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* My Appointments Modal */}
      <Modal visible={showAppointmentsModal} transparent animationType="slide" onRequestClose={() => setShowAppointmentsModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdropClose} activeOpacity={1} onPress={() => setShowAppointmentsModal(false)} />
          <View style={[styles.modalContainer, { maxHeight: '90%' }]}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lịch tư vấn của tôi</Text>
              <TouchableOpacity onPress={() => setShowAppointmentsModal(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color={Ink[700]} />
              </TouchableOpacity>
            </View>

            {loadingAppointments ? (
              <View style={styles.appointmentsLoadingBox}>
                <ActivityIndicator size="large" color={Brand[700]} />
                <Text style={styles.loadingText}>Đang tải lịch hẹn...</Text>
              </View>
            ) : appointments.length === 0 ? (
              <View style={styles.appointmentsEmptyBox}>
                <Ionicons name="calendar-outline" size={48} color={Ink[300]} />
                <Text style={styles.emptyTitle}>Chưa có lịch tư vấn</Text>
                <Text style={styles.emptyDesc}>Các lịch tư vấn bạn đã đặt với chuyên gia sẽ hiển thị ở đây.</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: Spacing.md }} showsVerticalScrollIndicator={false}>
                {appointments.map((appt) => {
                  const start = new Date(appt.scheduledStartAt);
                  const end = new Date(appt.scheduledEndAt);
                  const dateStr = `${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()}`;
                  const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

                  // Render status badge variant
                  let badgeVariant: 'brand' | 'blue' | 'success' | 'warning' | 'error' | 'neutral' = 'brand';
                  let statusLabel = 'Đã đặt';
                  if (appt.status === 'confirmed') {
                    badgeVariant = 'success';
                    statusLabel = 'Đã xác nhận';
                  } else if (appt.status === 'completed') {
                    badgeVariant = 'neutral';
                    statusLabel = 'Đã hoàn thành';
                  } else if (appt.status === 'cancelled') {
                    badgeVariant = 'error';
                    statusLabel = 'Đã hủy';
                  } else if (appt.status === 'pending_payment') {
                    badgeVariant = 'warning';
                    statusLabel = 'Chờ thanh toán';
                  }

                  const isCancellable = appt.status === 'booked' || appt.status === 'pending_payment' || appt.status === 'confirmed';

                  return (
                    <View key={appt._id} style={styles.apptCard}>
                      <View style={styles.apptHeader}>
                        <Avatar name={appt.expertId?.fullName || 'Chuyên gia'} size={38} />
                        <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                          <Text style={styles.apptExpertName}>{appt.expertId?.fullName || 'Chuyên gia ReMind'}</Text>
                          <Text style={styles.apptExpertTitle}>{appt.expertId?.expert?.profile?.professionalTitle || 'Chuyên gia Tâm lý'}</Text>
                        </View>
                        <Badge text={statusLabel} variant={badgeVariant} />
                      </View>

                      <View style={styles.apptDetails}>
                        <View style={styles.apptDetailRow}>
                          <Ionicons name="calendar-outline" size={14} color={Ink[500]} style={{ marginRight: 6 }} />
                          <Text style={styles.apptDetailText}>{dateStr}</Text>
                        </View>
                        <View style={styles.apptDetailRow}>
                          <Ionicons name="time-outline" size={14} color={Ink[500]} style={{ marginRight: 6 }} />
                          <Text style={styles.apptDetailText}>{timeStr}</Text>
                        </View>
                        {appt.amount !== undefined && (
                          <View style={styles.apptDetailRow}>
                            <Ionicons name="cash-outline" size={14} color={Ink[500]} style={{ marginRight: 6 }} />
                            <Text style={styles.apptDetailText}>{appt.amount.toLocaleString('vi-VN')} đ</Text>
                          </View>
                        )}
                      </View>

                      {isCancellable && (
                        <Button
                          title="Hủy lịch hẹn"
                          variant="ghost"
                          size="sm"
                          loading={cancellingId === appt._id}
                          disabled={cancellingId !== null}
                          onPress={() => handleCancelAppointment(appt._id)}
                          style={styles.cancelApptBtn}
                          textStyle={styles.cancelApptBtnText}
                        />
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <Button
              title="Đóng"
              variant="outline"
              onPress={() => setShowAppointmentsModal(false)}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        </View>
      </Modal>
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
    paddingBottom: 130, // Tăng padding bottom để không bị che bởi thanh điều hướng floating
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
    paddingBottom: 80, // Bù trừ cho thanh điều hướng floating
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalBackdropClose: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: Surface.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    maxHeight: '85%',
    ...Shadow.lg,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Surface.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  inputLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Ink[500],
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Surface.canvas,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Surface.border,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Ink[900],
  },
  appointmentsLoadingBox: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Ink[400],
    fontSize: FontSize.sm,
  },
  appointmentsEmptyBox: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Ink[900],
    marginTop: Spacing.sm,
  },
  emptyDesc: {
    fontSize: FontSize.sm,
    color: Ink[500],
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: Spacing.xl,
  },
  apptCard: {
    backgroundColor: Surface.canvas,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  apptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  apptExpertName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  apptExpertTitle: {
    fontSize: FontSize.xs,
    color: Ink[500],
  },
  apptDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
  },
  apptDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  apptDetailText: {
    fontSize: FontSize.sm,
    color: Ink[600],
  },
  cancelApptBtn: {
    borderColor: Semantic.error,
    borderWidth: 1,
    height: 38,
    borderRadius: Radius.md,
    marginTop: Spacing.xs,
  },
  cancelApptBtnText: {
    color: Semantic.error,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});

