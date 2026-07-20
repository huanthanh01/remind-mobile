import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import {
  Brand,
  Ink,
  Surface,
  Radius,
  FontSize,
  FontWeight,
  Spacing,
  Shadow,
  Semantic,
  CalmBlue,
} from '../../constants/theme';
import { ExpertService, ExpertProfile, MobileExpertSlot } from '../../services/expert.service';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';

function formatSlotTime(slot: MobileExpertSlot) {
  const start = new Date(slot.startAt);
  const end = new Date(slot.endAt);
  const dateStr = `${start.getDate()}/${start.getMonth() + 1}`;
  const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start
    .getMinutes()
    .toString()
    .padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return `${dateStr} (${timeStr})`;
}

export default function ExpertProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasBooked, setHasBooked] = useState(false);

  // Booking modal state
  const [booking, setBooking] = useState(false);
  const [slots, setSlots] = useState<MobileExpertSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const loadExpert = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await ExpertService.getExpertProfile(id);
      setExpert(data);

      const appointments = await ExpertService.getMyAppointments();
      const booked = appointments.some(
        (appt: any) => String(appt.expertId) === id && appt.status !== 'cancelled'
      );
      setHasBooked(booked);
    } catch (err) {
      console.log('Error loading expert details or appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadExpert();
  }, [loadExpert]);

  const handleOpenBooking = async () => {
    if (!expert) return;
    setBooking(true);
    setSelectedSlotId('');
    setSlots([]);
    setSlotsLoading(true);
    const slotList = await ExpertService.getExpertSlots(expert._id);
    setSlots(slotList);
    setSlotsLoading(false);
  };

  const handleConfirmBooking = async () => {
    if (!expert || !selectedSlotId) return;
    setBookingInProgress(true);
    try {
      const bookRes = await ExpertService.bookAppointment(expert._id, selectedSlotId);
      const apptId = (bookRes as any)?.appointment?._id;
      if (apptId) {
        const paymentRes = await ExpertService.createPayment(apptId);
        const checkoutUrl = (paymentRes as any)?.checkoutUrl;
        if (checkoutUrl) {
          await openBrowserAsync(checkoutUrl, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }
      setHasBooked(true);
      Alert.alert('Đặt lịch thành công', 'Lịch hẹn của bạn đã được ghi nhận thành công!', [
        { text: 'OK', onPress: () => setBooking(false) },
      ]);
    } catch (err: any) {
      Alert.alert('Thông báo', err.response?.data?.error || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header onBack={() => router.back()} />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Brand[700]} />
          <Text style={styles.loadingText}>Đang tải hồ sơ chuyên gia...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!expert) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header onBack={() => router.back()} />
        <View style={styles.centerBox}>
          <Ionicons name="person-outline" size={56} color={Ink[300]} />
          <Text style={styles.emptyTitle}>Không tìm thấy chuyên gia</Text>
          <Text style={styles.emptyDesc}>Hồ sơ này không tồn tại hoặc đã bị ẩn.</Text>
          <Button title="Quay lại" variant="outline" onPress={() => router.back()} style={{ marginTop: Spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  const priceText = expert.priceFrom ? `${expert.priceFrom.toLocaleString('vi-VN')} đ` : 'Miễn phí';
  const rating = expert.rating || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header onBack={() => router.back()} />

        {/* Hero */}
        <View style={styles.hero}>
          <Avatar uri={expert.avatar} name={expert.fullName} size={104} />
          <Text style={styles.name}>{expert.fullName}</Text>
          <Text style={styles.title}>{expert.title || 'Chuyên gia Tâm lý'}</Text>

          <View style={styles.ratingPill}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingValue}>{rating > 0 ? rating.toFixed(1) : 'Mới'}</Text>
            <Text style={styles.ratingCount}>
              {expert.reviewCount ? `· ${expert.reviewCount} đánh giá` : '· Chưa có đánh giá'}
            </Text>
          </View>

          {expert.yearsOfExperience ? (
            <View style={styles.expPill}>
              <Ionicons name="medal-outline" size={15} color={Brand[700]} />
              <Text style={styles.expText}>{expert.yearsOfExperience} năm kinh nghiệm</Text>
            </View>
          ) : null}
        </View>

        {/* Stat cards */}
        <View style={styles.statRow}>
          <StatCard label="Đánh giá" value={rating > 0 ? rating.toFixed(1) : '—'} icon="star" />
          <StatCard label="Lượt đánh giá" value={`${expert.reviewCount || 0}`} icon="chatbubble" />
          <StatCard label="Kinh nghiệm" value={expert.yearsOfExperience ? `${expert.yearsOfExperience}n` : '—'} icon="time" />
        </View>

        {/* Bio */}
        {expert.bio ? (
          <Section title="Giới thiệu">
            <Text style={styles.bio}>{expert.bio}</Text>
          </Section>
        ) : null}

        {/* Specialties */}
        {expert.specialties && expert.specialties.length > 0 ? (
          <Section title="Chuyên môn">
            <View style={styles.chipWrap}>
              {expert.specialties.map((s) => (
                <View key={s} style={styles.chip}>
                  <Text style={styles.chipText}>{s}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {/* Languages */}
        {expert.languages && expert.languages.length > 0 ? (
          <Section title="Ngôn ngữ">
            <View style={styles.chipWrap}>
              {expert.languages.map((l) => (
                <View key={l} style={[styles.chip, styles.chipAlt]}>
                  <Ionicons name="language" size={14} color={CalmBlue[600]} />
                  <Text style={[styles.chipText, styles.chipTextAlt]}>{l}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {/* Price */}
        <Section title="Chi phí tư vấn">
          <View style={styles.priceBox}>
            <Ionicons name="wallet-outline" size={22} color={Brand[700]} />
            <Text style={styles.priceValue}>{priceText}</Text>
            <Text style={styles.priceNote}>/ buổi</Text>
          </View>
        </Section>

        <View style={{ height: Spacing['4xl'] }} />
      </ScrollView>

      {/* Sticky action bar */}
      <View style={styles.actionBar}>
        {hasBooked && (
          <Button
            title="Nhắn tin"
            variant="outline"
            size="lg"
            style={{ flex: 1 }}
            onPress={() => Alert.alert('Thông báo', 'Tính năng nhắn tin với chuyên gia đang được phát triển.')}
          />
        )}
        <Button
          title="Đặt lịch"
          variant="primary"
          size="lg"
          style={{ flex: hasBooked ? 1.4 : 1 }}
          onPress={handleOpenBooking}
        />
      </View>

      {/* Booking modal */}
      <Modal visible={booking} transparent animationType="slide" onRequestClose={() => setBooking(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đặt lịch hẹn tư vấn</Text>
              <TouchableOpacity onPress={() => setBooking(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color={Ink[700]} />
              </TouchableOpacity>
            </View>

            <View style={styles.bookingExpertRow}>
              <Avatar uri={expert.avatar} name={expert.fullName} size={44} />
              <View style={{ marginLeft: Spacing.md }}>
                <Text style={styles.expertName}>{expert.fullName}</Text>
                <Text style={styles.expertTitle}>{expert.title || 'Chuyên gia Tâm lý'}</Text>
              </View>
            </View>

            <Text style={styles.slotLabel}>Chọn khung giờ còn trống:</Text>

            {slotsLoading ? (
              <ActivityIndicator size="small" color={Brand[700]} style={{ marginVertical: Spacing.xl }} />
            ) : slots.length === 0 ? (
              <Text style={styles.noSlotsText}>Chuyên gia hiện chưa có lịch trống khả dụng.</Text>
            ) : (
              <ScrollView style={{ maxHeight: 240 }} contentContainerStyle={{ gap: Spacing.xs }}>
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot._id;
                  return (
                    <TouchableOpacity
                      key={slot._id}
                      style={[styles.slotItem, isSelected && styles.slotItemSelected]}
                      onPress={() => setSelectedSlotId(slot._id)}
                    >
                      <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                        {formatSlotTime(slot)}
                      </Text>
                      <Text style={[styles.slotPrice, isSelected && styles.slotTextSelected]}>
                        {slot.price.toLocaleString('vi-VN')} đ
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <Button title="Hủy" variant="outline" onPress={() => setBooking(false)} style={{ flex: 1 }} />
              <Button
                title="Xác nhận"
                variant="primary"
                loading={bookingInProgress}
                disabled={!selectedSlotId}
                onPress={handleConfirmBooking}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={10}>
        <Ionicons name="arrow-back" size={24} color={Ink[900]} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Hồ sơ chuyên gia</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={18} color={Brand[700]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Surface.canvas },
  scroll: { paddingBottom: Spacing.lg },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  loadingText: { marginTop: Spacing.sm, color: Ink[500], fontSize: FontSize.sm },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Ink[900], marginTop: Spacing.sm },
  emptyDesc: { fontSize: FontSize.sm, color: Ink[500], textAlign: 'center', marginTop: 4 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Surface.white,
    borderBottomWidth: 1,
    borderBottomColor: Surface.border,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Ink[900] },

  hero: { alignItems: 'center', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.lg, backgroundColor: Surface.white },
  name: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Ink[900], marginTop: Spacing.sm },
  title: { fontSize: FontSize.base, color: Ink[500], marginTop: 2 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.sm,
    backgroundColor: Semantic.warningBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  ratingValue: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Semantic.warning },
  ratingCount: { fontSize: FontSize.sm, color: Ink[600] },
  expPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.sm,
    backgroundColor: Brand['050'],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  expText: { fontSize: FontSize.sm, color: Brand[700], fontWeight: FontWeight.medium },

  statRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginTop: Spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Surface.border,
    ...Shadow.sm,
  },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Ink[900], marginTop: 4 },
  statLabel: { fontSize: FontSize.xs, color: Ink[500], marginTop: 2 },

  section: {
    backgroundColor: Surface.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Surface.border,
    ...Shadow.sm,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Ink[900], marginBottom: Spacing.sm },
  bio: { fontSize: FontSize.base, color: Ink[700], lineHeight: 22 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Brand['050'],
    borderWidth: 1,
    borderColor: Brand[200],
  },
  chipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Brand[700] },
  chipAlt: { backgroundColor: CalmBlue['050'], borderColor: CalmBlue[100] },
  chipTextAlt: { color: CalmBlue[600] },

  priceBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  priceValue: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Brand[700] },
  priceNote: { fontSize: FontSize.sm, color: Ink[500] },

  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Surface.white,
    borderTopWidth: 1,
    borderTopColor: Surface.border,
    paddingBottom: Spacing.lg,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: Surface.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '82%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Ink[900] },
  bookingExpertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Surface.canvas,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  expertName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Ink[900] },
  expertTitle: { fontSize: FontSize.sm, color: Ink[500], marginTop: 2 },
  slotLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Ink[700], marginBottom: Spacing.xs },
  noSlotsText: { fontSize: FontSize.sm, color: Ink[500], marginVertical: Spacing.md, textAlign: 'center' },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Surface.border,
    backgroundColor: Surface.white,
  },
  slotItemSelected: { borderColor: Brand[700], backgroundColor: Brand['050'] },
  slotText: { fontSize: FontSize.sm, color: Ink[900] },
  slotPrice: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Brand[700] },
  slotTextSelected: { color: Brand[700], fontWeight: FontWeight.bold },
  modalActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
});
