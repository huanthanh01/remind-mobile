/**
 * PaymentFlow component (mobile).
 * Ported from web Payment.tsx – 3-step flow with step indicator:
 *   Step 1: Chọn phương thức thanh toán
 *   Step 2: Hiển thị QR PayOS (demo) / đang xử lý
 *   Step 3: Kết quả (success | failed)
 * Status machine mirrors web: pending -> success | failed.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Brand,
  Ink,
  Surface,
  Semantic,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  Shadow,
} from '../../constants/theme';
import Button from '../common/Button';
import { ExpertService } from '../../services/expert.service';

type Status = 'pending' | 'success' | 'failed';
type Method = 'momo' | 'vnpay' | 'card';

interface DemoQr {
  orderCode: number;
  amount: number;
  qrCode?: string;
  checkoutUrl?: string;
  note: string;
}

interface PaymentFlowProps {
  expert: { fullName: string; title?: string; priceFrom?: number };
  slot: { label: string; price: number };
  expertId: string;
  slotId: string;
  onClose: () => void;
  onOpenChat?: (appointmentId: string) => void;
}

const METHODS: { id: Method; name: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'momo', name: 'Ví MoMo', icon: 'wallet-outline' },
  { id: 'vnpay', name: 'VNPay', icon: 'qr-code-outline' },
  { id: 'card', name: 'Thẻ Tín dụng', icon: 'card-outline' },
];

export default function PaymentFlow({
  expert,
  slot,
  expertId,
  slotId,
  onClose,
  onOpenChat,
}: PaymentFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<Method>('vnpay');
  const [status, setStatus] = useState<Status>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoQr, setDemoQr] = useState<DemoQr | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  // ponytail: step 1 drives booking+pay in one shot (demo), then shows QR/result
  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg('');
    setStep(2);
    try {
      const bookRes: any = await ExpertService.bookAppointment(expertId, slotId);
      const apptId = bookRes?.appointment?._id;
      setAppointmentId(apptId);

      const payRes: any = await ExpertService.createPayment(apptId);

      if (payRes?.demoQr) {
        setDemoQr(payRes.demoQr);
        setIsProcessing(false);
        return;
      }
      if (payRes?.status === 'succeeded') {
        finish('success');
        return;
      }
      if (payRes?.checkoutUrl) {
        // ponytail: real gateway needs Linking.openURL; outside demo scope
        finish('success');
        return;
      }
      finish('success');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Không thể khởi tạo thanh toán.';
      setErrorMsg(msg);
      finish('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const finish = (s: Status) => {
    setStatus(s);
    setStep(3);
  };

  const formatVnd = (n: number) => `${n.toLocaleString('vi-VN')} VNĐ`;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Step indicator */}
      <View style={styles.stepIndicatorContainer}>
        {[1, 2, 3].map((n, i) => (
          <React.Fragment key={n}>
            <View style={[styles.stepBadge, step >= n && styles.stepBadgeActive]}>
              {n === 3 && step === 3 ? (
                <Ionicons
                  name={status === 'success' ? 'checkmark' : status === 'failed' ? 'close' : 'ellipsis-horizontal'}
                  size={14}
                  color={status === 'success' ? '#fff' : status === 'failed' ? '#fff' : Ink[600]}
                />
              ) : (
                <Text style={[styles.stepText, step >= n && styles.stepTextActive]}>{n}</Text>
              )}
            </View>
            {i < 2 && <View style={[styles.stepLine, step > n && styles.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>

      <Text style={styles.title}>{step === 3 ? (status === 'success' ? 'Thành công' : 'Thất bại') : 'Thanh toán lịch hẹn'}</Text>

      {/* Error banner */}
      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={Semantic.error} />
          <Text style={styles.errorBannerText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* STEP 1: method + summary */}
      {step === 1 && (
        <View style={styles.stepForm}>
          <View style={styles.summaryCard}>
            <View style={[styles.avatar, { backgroundColor: Brand[100] }]}>
              <Text style={styles.avatarText}>{expert.fullName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.expertName}>{expert.fullName}</Text>
              <Text style={styles.expertTitle}>{expert.title || 'Chuyên gia Tâm lý'}</Text>
              <Text style={styles.slotLabel}>{slot.label}</Text>
            </View>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Tổng cộng</Text>
            <Text style={styles.costVal}>{formatVnd(slot.price)}</Text>
          </View>

          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodCard, method === m.id && styles.methodCardActive]}
              onPress={() => setMethod(m.id)}
              activeOpacity={0.8}
            >
              <Ionicons name={m.icon} size={22} color={method === m.id ? Brand[700] : Ink[500]} />
              <Text style={[styles.methodName, method === m.id && styles.methodNameActive]}>{m.name}</Text>
              <View style={[styles.radio, method === m.id && styles.radioActive]}>
                {method === m.id && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
            </TouchableOpacity>
          ))}

          <Button
            title={`Thanh toán ${formatVnd(slot.price)}`}
            onPress={handlePay}
            loading={isProcessing}
            size="lg"
            icon={!isProcessing ? <MaterialCommunityIcons name="brain" size={18} color="#fff" /> : undefined}
            style={styles.actionBtn}
          />
        </View>
      )}

      {/* STEP 2: QR / processing */}
      {step === 2 && (
        <View style={styles.stepForm}>
          {isProcessing && !demoQr ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={Brand[700]} />
              <Text style={styles.loadingText}>Đang khởi tạo thanh toán...</Text>
            </View>
          ) : demoQr ? (
            <>
              <Text style={styles.subtitle}>{demoQr.note}</Text>
              <View style={styles.qrBox}>
                {demoQr.qrCode ? (
                  <Image
                    source={{
                      uri: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(demoQr.qrCode)}`,
                    }}
                    style={styles.qrImg}
                  />
                ) : (
                  <Ionicons name="qr-code-outline" size={96} color={Brand[700]} />
                )}
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mã đơn</Text>
                <Text style={styles.infoVal}>{demoQr.orderCode}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số tiền</Text>
                <Text style={styles.infoVal}>{formatVnd(demoQr.amount)}</Text>
              </View>

              <Button
                title="Tôi đã quét — Xác nhận"
                onPress={() => finish('success')}
                size="lg"
                icon={<Ionicons name="checkmark-done-outline" size={18} color="#fff" />}
                style={styles.actionBtn}
              />
              {demoQr.checkoutUrl && (
                <Button
                  title="Mở trang PayOS"
                  variant="outline"
                  onPress={() => finish('success')}
                  size="lg"
                  style={styles.actionBtn}
                />
              )}
            </>
          ) : null}
        </View>
      )}

      {/* STEP 3: result */}
      {step === 3 && (
        <View style={styles.stepForm}>
          <View style={[styles.resultIcon, status === 'success' ? styles.resultOk : styles.resultFail]}>
            <Ionicons name={status === 'success' ? 'checkmark' : 'close'} size={48} color="#fff" />
          </View>
          <Text style={styles.resultTitle}>
            {status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
          </Text>
          <Text style={styles.subtitle}>
            {status === 'success'
              ? `Lịch hẹn với ${expert.fullName} (${slot.label}) đã được ghi nhận.`
              : 'Giao dịch không thành công. Vui lòng thử lại.'}
          </Text>

          {status === 'success' && onOpenChat && appointmentId && (
            <Button
              title="Nhắn tin với chuyên gia"
              onPress={() => onOpenChat(appointmentId)}
              size="lg"
              icon={<Ionicons name="chatbubble-outline" size={18} color="#fff" />}
              style={styles.actionBtn}
            />
          )}
          {status === 'failed' && (
            <Button title="Thử lại" onPress={() => { setStep(1); setStatus('pending'); setErrorMsg(''); }} size="lg" style={styles.actionBtn} />
          )}
          <Button
            title={status === 'success' ? 'Quay về Trang chủ' : 'Quay lại'}
            variant="outline"
            onPress={onClose}
            size="lg"
            style={styles.actionBtn}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Surface.canvas,
    borderWidth: 1.5,
    borderColor: Ink[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeActive: {
    backgroundColor: Brand[700],
    borderColor: Brand[700],
  },
  stepText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Ink[600] },
  stepTextActive: { color: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: Surface.border, marginHorizontal: Spacing.xs },
  stepLineActive: { backgroundColor: Brand[700] },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Ink[900], marginBottom: Spacing.xs, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Ink[500], marginBottom: Spacing.xl, lineHeight: 20, textAlign: 'center' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Semantic.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(160,71,71,0.2)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  errorBannerText: { flex: 1, fontSize: FontSize.sm, color: Semantic.error },
  stepForm: { gap: Spacing.xs },
  actionBtn: { marginTop: Spacing.sm },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Surface.muted,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  avatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Brand[700] },
  expertName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Ink[900] },
  expertTitle: { fontSize: FontSize.xs, color: Ink[500] },
  slotLabel: { fontSize: FontSize.xs, color: Brand[700], marginTop: 2 },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Surface.border,
    marginBottom: Spacing.base,
  },
  costLabel: { fontSize: FontSize.sm, color: Ink[600] },
  costVal: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Ink[900] },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Ink[700], marginBottom: Spacing.xs },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Surface.white,
    borderWidth: 1,
    borderColor: Surface.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  methodCardActive: { borderColor: Brand[700], backgroundColor: Brand['050'] },
  methodName: { flex: 1, fontSize: FontSize.base, color: Ink[700], fontWeight: FontWeight.medium },
  methodNameActive: { color: Brand[700] },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: Ink[300], alignItems: 'center', justifyContent: 'center' },
  radioActive: { backgroundColor: Brand[700], borderColor: Brand[700] },
  centerBox: { alignItems: 'center', paddingVertical: Spacing['2xl'] },
  loadingText: { marginTop: Spacing.md, fontSize: FontSize.sm, color: Ink[500] },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Surface.white,
    borderWidth: 1,
    borderColor: Surface.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    alignSelf: 'center',
  },
  qrImg: { width: 220, height: 220, borderRadius: Radius.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: FontSize.sm, color: Ink[500] },
  infoVal: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Ink[900] },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  resultOk: { backgroundColor: Semantic.success },
  resultFail: { backgroundColor: Semantic.error },
  resultTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Ink[900], textAlign: 'center', marginBottom: Spacing.xs },
});
