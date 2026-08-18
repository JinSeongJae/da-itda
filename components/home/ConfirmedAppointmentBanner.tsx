import { Text, View } from 'react-native';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { Appointment, User } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';

function dDayLabel(dateIso: string): string {
  const diff = differenceInCalendarDays(parseISO(dateIso), new Date());
  if (diff === 0) return 'D-DAY';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function ConfirmedAppointmentBanner({
  appointment,
  counterpart,
}: {
  appointment: Appointment;
  counterpart: User;
}) {
  const { t } = useTranslation();
  return (
    <View className="bg-primary-600 px-6 py-5 rounded-3xl mt-3">
      <Text className="text-white/70 text-[13px] font-semibold">
        {dDayLabel(appointment.date)} · {formatDateTime(appointment.date, appointment.time)}
      </Text>
      <Text className="text-white text-[17px] font-extrabold mt-1.5">
        {t('home.appointmentWith', { name: counterpart.name })}
      </Text>
      <Text className="text-white/80 text-[13px] mt-0.5">
        {appointment.purpose ?? t('home.appointmentDefaultPurpose')}
      </Text>
    </View>
  );
}
