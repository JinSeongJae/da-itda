import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QRDisplay } from '../../../components/verification/QRDisplay';
import { QRScanButton } from '../../../components/verification/QRScanButton';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import { useAppointmentStore } from '../../../store/useAppointmentStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUserStore } from '../../../store/useUserStore';
import { useTranslation } from '../../../utils/i18n';

const REWARD_POINTS = 10;
const REWARD_VOLUNTEER_MINUTES = 30;

export default function MeetupQr() {
  const { t } = useTranslation();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const appointment = useAppointmentStore((s) => s.appointmentsById[appointmentId]);
  const checkIn = useAppointmentStore((s) => s.checkIn);
  const addPoints = useUserStore((s) => s.addPoints);
  const addVolunteerMinutes = useUserStore((s) => s.addVolunteerMinutes);

  const [justCheckedIn, setJustCheckedIn] = useState(false);

  if (!appointment) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('meetupQr.title')} showBack />
        <Text className="text-center text-gray-500 mt-10">{t('meetupQr.notFound')}</Text>
      </SafeAreaView>
    );
  }

  const alreadyCheckedIn = appointment.checkIns.some((c) => c.userId === currentUserId);

  const handleScanned = () => {
    checkIn(appointmentId, currentUserId);
    addPoints(currentUserId, REWARD_POINTS);
    addVolunteerMinutes(currentUserId, REWARD_VOLUNTEER_MINUTES);
    setJustCheckedIn(true);
  };

  const checkedIn = alreadyCheckedIn || justCheckedIn;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('meetupQr.title')} showBack />
      <View className="flex-1 px-6 pt-6">
        <Text className="text-gray-500 text-sm mb-5 text-center">{t('meetupQr.subtitle')}</Text>
        <QRDisplay token={appointment.qrToken ?? '------------'} />

        {checkedIn ? (
          <View className="bg-primary-50 rounded-2xl p-4 mt-5 items-center">
            <Feather name="check-circle" size={22} color="#10b981" />
            <Text className="text-primary-700 font-bold mt-2">{t('meetupQr.checkedInTitle')}</Text>
            <Text className="text-primary-600 text-xs mt-1">
              {t('meetupQr.reward', { points: REWARD_POINTS, minutes: REWARD_VOLUNTEER_MINUTES })}
            </Text>
          </View>
        ) : (
          <QRScanButton onScanned={handleScanned} />
        )}

        {checkedIn && (
          <Button
            label={t('meetupQr.reviewButton')}
            className="mt-4"
            onPress={() => router.push(`/meetup/${appointmentId}/review`)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
