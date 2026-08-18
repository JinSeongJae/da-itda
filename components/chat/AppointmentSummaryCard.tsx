import { Pressable, Text, View } from 'react-native';
import type { Appointment, SafeZone } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';

export function AppointmentSummaryCard({
  appointment,
  safeZone,
  onCheckIn,
}: {
  appointment: Appointment;
  safeZone?: SafeZone;
  onCheckIn: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View className="self-center bg-primary-50 rounded-3xl p-5 my-2 max-w-[90%] w-72">
      <Text className="text-[13px] font-semibold text-primary-600">{t('appointmentCard.confirmed')}</Text>
      <Text className="text-[15px] font-bold text-gray-900 mt-1.5">
        {formatDateTime(appointment.date, appointment.time)}
      </Text>
      <Text className="text-[13px] text-gray-500 mt-0.5">{safeZone?.name ?? t('appointmentCard.defaultZone')}</Text>
      {!!appointment.purpose && (
        <Text className="text-[13px] text-gray-500 mt-0.5">{appointment.purpose}</Text>
      )}
      <Pressable onPress={onCheckIn} className="bg-primary-500 rounded-full py-3 items-center mt-4">
        <Text className="text-white text-[14px] font-bold">{t('appointmentCard.checkinButton')}</Text>
      </Pressable>
    </View>
  );
}
