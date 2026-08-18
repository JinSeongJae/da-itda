import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { Appointment, User } from '../../types';
import { formatDateTime } from '../../utils/formatters';

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
  return (
    <View className="bg-primary-500 rounded-2xl p-4 mt-4">
      <View className="flex-row items-center">
        <View className="bg-white/20 rounded-full px-2.5 py-1 mr-2">
          <Text className="text-white text-xs font-extrabold">{dDayLabel(appointment.date)}</Text>
        </View>
        <Feather name="calendar" size={14} color="#fff" />
        <Text className="text-white text-xs ml-1.5">{formatDateTime(appointment.date, appointment.time)}</Text>
      </View>
      <Text className="text-white text-sm font-bold mt-2">
        {counterpart.name} 이웃과 '{appointment.purpose ?? '이웃 교류'}' 약속
      </Text>
    </View>
  );
}
