import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QRDisplay } from '../../../components/verification/QRDisplay';
import { QRCameraScanner } from '../../../components/verification/QRCameraScanner';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import { useAppointmentStore } from '../../../store/useAppointmentStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChatStore } from '../../../store/useChatStore';
import { useUserStore } from '../../../store/useUserStore';
import { useTranslation } from '../../../utils/i18n';

const REWARD_POINTS = 10;
const REWARD_VOLUNTEER_MINUTES = 30;
const CHECKIN_QR_PATTERN = /^daitda:\/\/checkin\/([^/]+)\/([^/]+)$/;

export default function MeetupQr() {
  const { t } = useTranslation();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const appointment = useAppointmentStore((s) => s.appointmentsById[appointmentId]);
  const checkIn = useAppointmentStore((s) => s.checkIn);
  const addPoints = useUserStore((s) => s.addPoints);
  const addVolunteerMinutes = useUserStore((s) => s.addVolunteerMinutes);
  const thread = useChatStore((s) => (appointment ? s.threadsById[appointment.threadId] : undefined));

  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  if (!appointment) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('meetupQr.title')} showBack />
        <Text className="text-center text-gray-500 mt-10">{t('meetupQr.notFound')}</Text>
      </SafeAreaView>
    );
  }

  const counterpartId = thread?.participantIds.find((id) => id !== currentUserId);
  // "체크인됨"은 상대방이 내 QR을 스캔해줘야 생긴다 — 내가 상대방을 스캔했는지와는 별개.
  const iAmCheckedIn = appointment.checkIns.some((c) => c.userId === currentUserId);
  const iHaveScannedCounterpart = !!counterpartId && appointment.checkIns.some((c) => c.userId === counterpartId);

  const handleScanned = (data: string) => {
    setScanning(false);
    const match = data.match(CHECKIN_QR_PATTERN);
    if (!match) {
      setScanError(t('meetupQr.invalidQr'));
      return;
    }
    const [, scannedAppointmentId, scannedUserId] = match;
    if (scannedAppointmentId !== appointment.id || !counterpartId || scannedUserId !== counterpartId) {
      setScanError(t('meetupQr.wrongQr'));
      return;
    }

    // 상대방을 실제로 스캔해서 "그 사람"을 체크인시킨다 — 보상은 스캔을 완료한 나 자신에게.
    checkIn(appointment.id, scannedUserId);
    addPoints(currentUserId, REWARD_POINTS);
    addVolunteerMinutes(currentUserId, REWARD_VOLUNTEER_MINUTES);
    setScanError('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('meetupQr.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 text-sm mb-5 text-center">{t('meetupQr.subtitle')}</Text>
        <QRDisplay appointmentId={appointment.id} userId={currentUserId} />

        {iAmCheckedIn && (
          <View className="bg-primary-50 rounded-2xl p-4 mt-5 items-center">
            <Feather name="check-circle" size={22} color="#10b981" />
            <Text className="text-primary-700 font-bold mt-2">{t('meetupQr.checkedInTitle')}</Text>
          </View>
        )}

        {iHaveScannedCounterpart ? (
          <View className="flex-row items-center bg-gray-50 rounded-2xl p-4 mt-4">
            <Feather name="check" size={16} color="#059669" />
            <Text className="text-gray-600 text-xs ml-2 flex-1">
              {t('meetupQr.reward', { points: REWARD_POINTS, minutes: REWARD_VOLUNTEER_MINUTES })}
            </Text>
          </View>
        ) : scanning ? (
          <QRCameraScanner onScanned={handleScanned} onCancel={() => setScanning(false)} />
        ) : (
          <Pressable
            onPress={() => {
              setScanError('');
              setScanning(true);
            }}
            className="flex-row items-center justify-center rounded-2xl py-3.5 mt-4 bg-primary-500"
          >
            <Feather name="camera" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text className="text-white text-base font-semibold">{t('qrScan.button')}</Text>
          </Pressable>
        )}

        {!!scanError && (
          <View className="flex-row items-center bg-red-50 rounded-2xl px-4 py-3 mt-3">
            <Feather name="alert-circle" size={14} color="#ef4444" />
            <Text className="text-red-500 text-xs ml-2 flex-1">{scanError}</Text>
          </View>
        )}

        {iAmCheckedIn && (
          <Button
            label={t('meetupQr.reviewButton')}
            className="mt-4"
            onPress={() => router.push(`/meetup/${appointmentId}/review`)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
