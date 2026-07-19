import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Brand, Ink, Surface, Radius, FontSize, FontWeight, Spacing, Shadow } from '../../constants/theme';
import { ExpertService, MobileExpert, MobileExpertSlot } from '../../services/expert.service';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';

const SPECIALTIES = ['Tất cả', 'Trầm cảm', 'Lo âu', 'Stress công việc', 'Mối quan hệ', 'LGBTQ+'];
const LANGUAGES = ['Tất cả', 'Tiếng Việt', 'Tiếng Anh'];
const COSTS = ['Tất cả', 'Miễn phí', '< 500k', '>= 500k'];

export default function ExpertsScreen() {
  const [experts, setExperts] = useState<MobileExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tất cả');
  const [selectedLanguage, setSelectedLanguage] = useState('Tất cả');
  const [selectedCost, setSelectedCost] = useState('Tất cả');

  // Booking Modal
  const [bookingExpert, setBookingExpert] = useState<MobileExpert | null>(null);
  const [slots, setSlots] = useState<MobileExpertSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    setLoading(true);
    const data = await ExpertService.getApprovedExperts();
    setExperts(data);
    setLoading(false);
  };

  const filteredExperts = experts.filter((e) => {
    const nameMatch = (e.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.bio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.specialties || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const specMatch = selectedSpecialty === 'Tất cả' ||
      (e.specialties && e.specialties.includes(selectedSpecialty));

    const langMatch = selectedLanguage === 'Tất cả' ||
      (e.languages && e.languages.includes(selectedLanguage));

    let costMatch = true;
    const price = e.priceFrom || 0;
    if (selectedCost === 'Miễn phí') costMatch = price === 0;
    else if (selectedCost === '< 500k') costMatch = price > 0 && price <= 500000;
    else if (selectedCost === '>= 500k') costMatch = price >= 500000;

    return nameMatch && specMatch && langMatch && costMatch;
  });

  const handleOpenBooking = async (expert: MobileExpert) => {
    setBookingExpert(expert);
    setSelectedSlotId('');
    setSlots([]);
    setSlotsLoading(true);

    const slotList = await ExpertService.getExpertSlots(expert._id);
    setSlots(slotList);
    setSlotsLoading(false);
  };

  const handleConfirmBooking = async () => {
    if (!bookingExpert || !selectedSlotId) return;

    setBookingInProgress(true);
    try {
      const bookRes = await ExpertService.bookAppointment(bookingExpert._id, selectedSlotId);
      const apptId = (bookRes as any)?.appointment?._id;
      if (apptId) {
        await ExpertService.createPayment(apptId);
      }
      Alert.alert('Đặt lịch thành công', 'Lịch hẹn của bạn đã được ghi nhận thành công!', [
        { text: 'OK', onPress: () => setBookingExpert(null) },
      ]);
    } catch (err: any) {
      Alert.alert('Thông báo', err.response?.data?.error || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
      setBookingInProgress(false);
    }
  };

  const formatSlotTime = (slot: MobileExpertSlot) => {
    const start = new Date(slot.startAt);
    const end = new Date(slot.endAt);
    const dateStr = `${start.getDate()}/${start.getMonth() + 1}`;
    const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
    return `${dateStr} (${timeStr})`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Danh mục Chuyên gia</Text>
        <Text style={styles.subtitle}>Tìm kiếm bác sĩ và chuyên gia tâm lý phù hợp với bạn</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Ink[400]} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên, chuyên môn..."
          placeholderTextColor={Ink[400]}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Ionicons name="close-circle" size={18} color={Ink[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters Horizontal Scroll */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {SPECIALTIES.map((spec) => (
            <TouchableOpacity
              key={spec}
              style={[styles.chip, selectedSpecialty === spec && styles.chipActive]}
              onPress={() => setSelectedSpecialty(spec)}
            >
              <Text style={[styles.chipText, selectedSpecialty === spec && styles.chipTextActive]}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Brand[700]} />
          <Text style={styles.loadingText}>Đang tải danh sách chuyên gia...</Text>
        </View>
      ) : filteredExperts.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="search-outline" size={48} color={Ink[300]} />
          <Text style={styles.emptyTitle}>Không tìm thấy chuyên gia</Text>
          <Text style={styles.emptyDesc}>Thử tìm kiếm với từ khóa khác hoặc bỏ lọc</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExperts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.expertCard}>
              <View style={styles.cardHeader}>
                <Avatar name={item.fullName} size={48} />
                <View style={styles.expertInfo}>
                  <Text style={styles.expertName}>{item.fullName}</Text>
                  <Text style={styles.expertTitle}>{item.title || 'Chuyên gia Tâm lý'}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.9 (48 đánh giá)</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.bioText} numberOfLines={2}>
                {item.bio || 'Chuyên gia nhiều năm kinh nghiệm tư vấn và trị liệu tâm lý.'}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Chi phí</Text>
                  <Text style={styles.priceVal}>
                    {item.priceFrom ? `${item.priceFrom.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                  </Text>
                </View>

                <Button
                  title="Đặt lịch"
                  onPress={() => handleOpenBooking(item)}
                  size="sm"
                  variant="primary"
                />
              </View>
            </View>
          )}
        />
      )}

      {/* Booking Modal */}
      {bookingExpert && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Đặt lịch hẹn tư vấn</Text>
                <TouchableOpacity onPress={() => setBookingExpert(null)}>
                  <Ionicons name="close" size={24} color={Ink[700]} />
                </TouchableOpacity>
              </View>

              <View style={styles.bookingExpertRow}>
                <Avatar name={bookingExpert.fullName} size={40} />
                <View style={{ marginLeft: Spacing.md }}>
                  <Text style={styles.expertName}>{bookingExpert.fullName}</Text>
                  <Text style={styles.expertTitle}>{bookingExpert.title || 'Chuyên gia Tâm lý'}</Text>
                </View>
              </View>

              <Text style={styles.slotLabel}>Chọn khung giờ còn trống:</Text>

              {slotsLoading ? (
                <ActivityIndicator size="small" color={Brand[700]} style={{ marginVertical: Spacing.xl }} />
              ) : slots.length === 0 ? (
                <Text style={styles.noSlotsText}>Chuyên gia hiện chưa có lịch trống khả dụng.</Text>
              ) : (
                <ScrollView style={{ maxHeight: 220 }} contentContainerStyle={{ gap: Spacing.xs }}>
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
                <Button
                  title="Hủy"
                  variant="outline"
                  onPress={() => setBookingExpert(null)}
                  style={{ flex: 1 }}
                />
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Surface.white,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Ink[900],
  },
  filterSection: {
    marginBottom: Spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Surface.white,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  chipActive: {
    backgroundColor: Brand[700],
    borderColor: Brand[700],
  },
  chipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Ink[700],
  },
  chipTextActive: {
    color: Surface.white,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  expertCard: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Surface.border,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expertInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  expertName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  expertTitle: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.xs,
    color: Ink[600],
  },
  bioText: {
    fontSize: FontSize.sm,
    color: Ink[700],
    marginVertical: Spacing.sm,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Surface.muted,
    paddingTop: Spacing.sm,
  },
  priceBox: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: FontSize.xs,
    color: Ink[400],
  },
  priceVal: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Brand[700],
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Ink[500],
    fontSize: FontSize.sm,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Surface.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Ink[900],
  },
  bookingExpertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Surface.canvas,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  slotLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Ink[700],
    marginBottom: Spacing.xs,
  },
  noSlotsText: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginVertical: Spacing.md,
    textAlign: 'center',
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Surface.border,
    backgroundColor: Surface.white,
  },
  slotItemSelected: {
    borderColor: Brand[700],
    backgroundColor: Brand['050'],
  },
  slotText: {
    fontSize: FontSize.sm,
    color: Ink[900],
  },
  slotPrice: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Brand[700],
  },
  slotTextSelected: {
    color: Brand[700],
    fontWeight: FontWeight.bold,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});
