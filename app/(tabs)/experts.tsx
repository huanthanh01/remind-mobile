import React, { useState, useEffect, useCallback } from "react";
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
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Brand,
  Ink,
  Surface,
  Radius,
  FontSize,
  FontWeight,
  Spacing,
  Shadow,
} from "../../constants/theme";
import {
  ExpertService,
  MobileExpert,
  MobileExpertSlot,
} from "../../services/expert.service";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";
import PaymentFlow from "../../components/payment/PaymentFlow";
import AuthModal from "../../components/common/AuthModal";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../stores/auth.store";

const SPECIALTIES = [
  "Tất cả",
  "Trầm cảm",
  "Lo âu",
  "Stress công việc",
  "Mối quan hệ",
  "LGBTQ+",
];
const LANGUAGES = ["Tất cả", "Tiếng Việt", "Tiếng Anh"];
const COSTS = ["Tất cả", "Miễn phí", "< 500k", ">= 500k"];

export default function ExpertsScreen() {
  const { isAuthenticated } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [experts, setExperts] = useState<MobileExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả");
  const [selectedLanguage, setSelectedLanguage] = useState("Tất cả");
  const [selectedCost, setSelectedCost] = useState("Tất cả");

  // Booking Modal
  const [bookingExpert, setBookingExpert] = useState<MobileExpert | null>(null);
  const [slots, setSlots] = useState<MobileExpertSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<{
    expert: MobileExpert;
    slot: MobileExpertSlot;
  } | null>(null);

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async (isRef = false) => {
    if (isRef) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await ExpertService.getApprovedExperts();
      setExperts(data);
    } catch (err) {
      console.error("Error loading experts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadExperts(true);
  }, []);

  const filteredExperts = experts.filter((e) => {
    const nameMatch =
      (e.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.bio || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.specialties || []).some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const specMatch =
      selectedSpecialty === "Tất cả" ||
      (e.specialties && e.specialties.includes(selectedSpecialty));

    const langMatch =
      selectedLanguage === "Tất cả" ||
      (e.languages && e.languages.includes(selectedLanguage));

    let costMatch = true;
    const price = e.priceFrom || 0;
    if (selectedCost === "Miễn phí") costMatch = price === 0;
    else if (selectedCost === "< 500k")
      costMatch = price > 0 && price <= 500000;
    else if (selectedCost === ">= 500k") costMatch = price >= 500000;

    return nameMatch && specMatch && langMatch && costMatch;
  });

  const handleOpenBooking = async (expert: MobileExpert) => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }
    setBookingExpert(expert);
    setSelectedSlotId("");
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
      const bookRes = await ExpertService.bookAppointment(
        bookingExpert._id,
        selectedSlotId,
      );
      const apptId = (bookRes as any)?.appointment?._id;
      if (apptId) {
        await ExpertService.createPayment(apptId);
      }
      Alert.alert(
        "Đặt lịch thành công",
        "Lịch hẹn của bạn đã được ghi nhận thành công!",
        [{ text: "OK", onPress: () => setBookingExpert(null) }],
      );
    } catch (err: any) {
      Alert.alert(
        "Thông báo",
        err.response?.data?.error || "Có lỗi xảy ra khi đặt lịch",
      );
    } finally {
      setBookingInProgress(false);
    }
  };

  const formatSlotTime = (slot: MobileExpertSlot) => {
    const start = new Date(slot.startAt);
    const end = new Date(slot.endAt);
    const dateStr = `${start.getDate()}/${start.getMonth() + 1}`;
    const timeStr = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")} - ${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`;
    return `${dateStr} (${timeStr})`;
  };

  return (
    <View style={styles.container}>
      {/* Curved Banner Header */}
      <View style={styles.coverContainer}>
        <View style={styles.coverBlob1} />
        <View style={styles.coverBlob2} />
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục Chuyên gia</Text>
          <Text style={styles.subtitle}>
            Tìm kiếm bác sĩ và chuyên gia tâm lý phù hợp với bạn
          </Text>
        </View>

        {/* Search Input Floating */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={Ink[400]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên, chuyên môn..."
            placeholderTextColor={Ink[400]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Ionicons name="close-circle" size={18} color={Ink[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters Horizontal Scrolls */}
        <View style={styles.filterSection}>
          {/* Specialty Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <View style={styles.filterLabelContainer}>
              <Ionicons name="sparkles" size={12} color={Brand[700]} />
              <Text style={styles.filterLabelInline}>Lĩnh vực</Text>
            </View>
            {SPECIALTIES.map((spec) => (
              <TouchableOpacity
                key={spec}
                style={[
                  styles.chip,
                  selectedSpecialty === spec && styles.chipActive,
                ]}
                onPress={() => setSelectedSpecialty(spec)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSpecialty === spec && styles.chipTextActive,
                  ]}
                >
                  {spec}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Language Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            style={{ marginTop: Spacing.xs }}
          >
            <View style={styles.filterLabelContainer}>
              <Ionicons name="globe-outline" size={12} color={Brand[700]} />
              <Text style={styles.filterLabelInline}>Ngôn ngữ</Text>
            </View>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.chip,
                  selectedLanguage === lang && styles.chipActive,
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedLanguage === lang && styles.chipTextActive,
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Cost Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            style={{ marginTop: Spacing.xs }}
          >
            <View style={styles.filterLabelContainer}>
              <Ionicons name="cash-outline" size={12} color={Brand[700]} />
              <Text style={styles.filterLabelInline}>Chi phí</Text>
            </View>
            {COSTS.map((cost) => (
              <TouchableOpacity
                key={cost}
                style={[
                  styles.chip,
                  selectedCost === cost && styles.chipActive,
                ]}
                onPress={() => setSelectedCost(cost)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCost === cost && styles.chipTextActive,
                  ]}
                >
                  {cost}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Brand[700]} />
            <Text style={styles.loadingText}>
              Đang tải danh sách chuyên gia...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredExperts}
            keyExtractor={(item) => item._id}
            contentContainerStyle={[
              styles.listContainer,
              filteredExperts.length === 0 && {
                flexGrow: 1,
                justifyContent: "center",
              },
            ]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Brand[700]]}
                tintColor={Brand[700]}
              />
            }
            ListEmptyComponent={
              <View style={styles.centerBox}>
                <Ionicons name="search-outline" size={48} color={Ink[300]} />
                <Text style={styles.emptyTitle}>Không tìm thấy chuyên gia</Text>
                <Text style={styles.emptyDesc}>
                  Thử tìm kiếm với từ khóa khác hoặc bỏ lọc
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.expertCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatarWrapper}>
                    <Avatar name={item.fullName} size={52} />
                    <View style={styles.activeDotBadge} />
                  </View>
                  <View style={styles.expertInfo}>
                    <Text style={styles.expertName}>{item.fullName}</Text>
                    <Text style={styles.expertTitle}>
                      {item.title || "Chuyên gia Tâm lý"}
                    </Text>
                    <View style={styles.metaRow}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={11} color="#F59E0B" />
                        <Text style={styles.ratingValue}>4.9</Text>
                      </View>
                      <Text style={styles.reviewCount}>(48 đánh giá)</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.bioText} numberOfLines={2}>
                  {item.bio ||
                    "Chuyên gia nhiều năm kinh nghiệm tư vấn và trị liệu tâm lý."}
                </Text>

                {/* Specialties & languages tags */}
                <View style={styles.tagsContainer}>
                  {(item.specialties || []).slice(0, 3).map((spec, i) => (
                    <Badge
                      key={i}
                      text={spec}
                      variant={i % 2 === 0 ? "brand" : "blue"}
                      style={styles.specialtyBadge}
                    />
                  ))}
                  {(item.languages || []).slice(0, 1).map((lang, i) => (
                    <Badge
                      key={`lang-${i}`}
                      text={lang}
                      variant="neutral"
                      style={styles.specialtyBadge}
                    />
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Chi phí từ</Text>
                    <Text style={styles.priceVal}>
                      {item.priceFrom
                        ? `${item.priceFrom.toLocaleString("vi-VN")} đ`
                        : "Miễn phí"}
                    </Text>
                  </View>

                  <Button
                    title="Đặt lịch hẹn"
                    onPress={() => handleOpenBooking(item)}
                    size="sm"
                    variant="primary"
                    style={styles.bookBtn}
                  />
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>

      {/* Booking Modal (Bottom Sheet style) */}
      {bookingExpert && (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setBookingExpert(null)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdropClose}
              activeOpacity={1}
              onPress={() => setBookingExpert(null)}
            />
            <View style={styles.modalContainer}>
              {paymentBooking ? (
                <PaymentFlow
                  expert={{
                    fullName: paymentBooking.expert.fullName,
                    title: paymentBooking.expert.title,
                  }}
                  slot={{
                    label: formatSlotTime(paymentBooking.slot),
                    price: paymentBooking.slot.price,
                  }}
                  expertId={paymentBooking.expert._id}
                  slotId={paymentBooking.slot._id}
                  onClose={() => setPaymentBooking(null)}
                />
              ) : (
                <>
                  {/* Handle Bar */}
                  <View style={styles.bottomSheetHandle} />

                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Đặt lịch hẹn tư vấn</Text>
                    <TouchableOpacity
                      style={styles.modalCloseBtn}
                      onPress={() => setBookingExpert(null)}
                    >
                      <Ionicons name="close" size={20} color={Ink[700]} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.bookingExpertRow}>
                    <Avatar name={bookingExpert.fullName} size={40} />
                    <View style={{ marginLeft: Spacing.md }}>
                      <Text style={styles.expertName}>
                        {bookingExpert.fullName}
                      </Text>
                      <Text style={styles.expertTitle}>
                        {bookingExpert.title || "Chuyên gia Tâm lý"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.slotLabel}>
                    Chọn khung giờ còn trống:
                  </Text>

                  {slotsLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={Brand[700]}
                      style={{ marginVertical: Spacing.xl }}
                    />
                  ) : slots.length === 0 ? (
                    <Text style={styles.noSlotsText}>
                      Chuyên gia hiện chưa có lịch trống khả dụng.
                    </Text>
                  ) : (
                    <ScrollView
                      style={{ maxHeight: 220 }}
                      contentContainerStyle={{ gap: Spacing.xs }}
                    >
                      {slots.map((slot) => {
                        const isSelected = selectedSlotId === slot._id;
                        return (
                          <TouchableOpacity
                            key={slot._id}
                            style={[
                              styles.slotItem,
                              isSelected && styles.slotItemSelected,
                            ]}
                            onPress={() => setSelectedSlotId(slot._id)}
                          >
                            <Text
                              style={[
                                styles.slotText,
                                isSelected && styles.slotTextSelected,
                              ]}
                            >
                              {formatSlotTime(slot)}
                            </Text>
                            <Text
                              style={[
                                styles.slotPrice,
                                isSelected && styles.slotTextSelected,
                              ]}
                            >
                              {slot.price.toLocaleString("vi-VN")} đ
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
                      title="Xác nhận đặt lịch"
                      variant="primary"
                      loading={bookingInProgress}
                      disabled={!selectedSlotId}
                      onPress={handleConfirmBooking}
                      style={{ flex: 2 }}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        title="Yêu cầu Đăng nhập"
        message="Vui lòng đăng nhập bằng tài khoản học viên để thực hiện đặt lịch hẹn tư vấn với chuyên gia tâm lý."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
  coverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: Brand[700],
    overflow: "hidden",
  },
  coverBlob1: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  coverBlob2: {
    position: "absolute",
    bottom: -80,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize["2xl"],
    fontWeight: FontWeight.bold,
    color: Surface.white,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: Spacing.xs,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Surface.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: "rgba(23, 107, 104, 0.15)",
    ...Shadow.md,
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
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  filterScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    alignItems: "center",
  },
  filterLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Spacing.xs,
    backgroundColor: Brand["050"],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    gap: 4,
  },
  filterLabelInline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Brand[700],
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
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
    color: Ink[600],
  },
  chipTextActive: {
    color: Surface.white,
    fontWeight: FontWeight.bold,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  expertCard: {
    backgroundColor: Surface.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: "rgba(214, 226, 224, 0.8)",
    ...Shadow.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  activeDotBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: Surface.white,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: Spacing.xs,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    gap: 3,
  },
  ratingValue: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: "#D97706",
  },
  reviewCount: {
    fontSize: FontSize.xs,
    color: Ink[400],
  },
  bioText: {
    fontSize: FontSize.sm,
    color: Ink[600],
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  specialtyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Surface.muted,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  priceBox: {
    flexDirection: "column",
  },
  priceLabel: {
    fontSize: FontSize.xs,
    color: Ink[400],
  },
  priceVal: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Brand[700],
  },
  bookBtn: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadow.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalBackdropClose: {
    position: "absolute",
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
    maxHeight: "85%",
    ...Shadow.lg,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Surface.border,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  bookingExpertRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Surface.canvas,
    borderRadius: Radius.lg,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Surface.border,
  },
  slotLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Ink[700],
    marginBottom: Spacing.sm,
  },
  noSlotsText: {
    fontSize: FontSize.sm,
    color: Ink[500],
    marginVertical: Spacing.xl,
    textAlign: "center",
  },
  slotItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Surface.border,
    backgroundColor: Surface.white,
  },
  slotItemSelected: {
    borderColor: Brand[700],
    backgroundColor: Brand["050"],
  },
  slotLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  slotText: {
    fontSize: FontSize.sm,
    color: Ink[700],
  },
  slotPrice: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Brand[700],
  },
  slotTextSelected: {
    color: Brand[700],
    fontWeight: FontWeight.bold,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Ink[400],
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
    textAlign: "center",
    marginTop: 4,
  },
});
