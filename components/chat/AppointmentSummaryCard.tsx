import { Pressable, Text, View } from 'react-native';
import type { Appointment, SafeZone } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';

export function AppointmentSummaryCard({
  appointment,
  safeZone,
  isCreator,
  onCheckIn,
  onAccept,
  onReject,
}: {
  appointment: Appointment;
  safeZone?: SafeZone;
  isCreator: boolean;
  onCheckIn: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const { t } = useTranslation();

  const statusLabelKey =
    appointment.status === 'pending'
      ? 'appointmentCard.pendingLabel'
      : appointment.status === 'cancelled'
        ? 'appointmentCard.cancelledLabel'
        : 'appointmentCard.confirmed';

  return (
    <View className="self-center bg-primary-50 rounded-3xl p-5 my-2 max-w-[90%] w-72">
      <Text className="text-[13px] font-semibold text-primary-600">{t(statusLabelKey)}</Text>
      <Text className="text-[15px] font-bold text-gray-900 mt-1.5">
        {formatDateTime(appointment.date, appointment.time)}
      </Text>
      <Text className="text-[13px] text-gray-500 mt-0.5">{safeZone?.name ?? t('appointmentCard.defaultZone')}</Text>
      {!!appointment.purpose && (
        <Text className="text-[13px] text-gray-500 mt-0.5">{appointment.purpose}</Text>
      )}

      {appointment.status === 'pending' && isCreator && (
        <Text className="text-[12px] text-gray-400 mt-4 text-center">{t('appointmentCard.waitingForAccept')}</Text>
      )}

      {appointment.status === 'pending' && !isCreator && (
        <View className="flex-row mt-4">
          <Pressable onPress={onReject} className="flex-1 bg-white border border-gray-200 rounded-full py-3 items-center mr-2">
            <Text className="text-gray-600 text-[14px] font-bold">{t('appointmentCard.rejectButton')}</Text>
          </Pressable>
          <Pressable onPress={onAccept} className="flex-1 bg-primary-500 rounded-full py-3 items-center">
            <Text className="text-white text-[14px] font-bold">{t('appointmentCard.acceptButton')}</Text>
          </Pressable>
        </View>
      )}

      {(appointment.status === 'confirmed' || appointment.status === 'checked-in') && (
        <Pressable onPress={onCheckIn} className="bg-primary-500 rounded-full py-3 items-center mt-4">
          <Text className="text-white text-[14px] font-bold">{t('appointmentCard.checkinButton')}</Text>
        </Pressable>
      )}
    </View>
  );
}
