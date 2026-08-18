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
    <View className="bg-primary-600 rounded-3xl p-4 mt-4 flex-row items-center overflow-hidden">
      <View className="flex-1">
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full px-2.5 py-1 mr-2">
            <Text className="text-white text-xs font-extrabold">{dDayLabel(appointment.date)}</Text>
          </View>
          <Text className="text-white/80 text-xs">{formatDateTime(appointment.date, appointment.time)}</Text>
        </View>
        <Text className="text-white text-sm font-bold mt-2">
          {counterpart.name} 이웃과 &apos;{appointment.purpose ?? '이웃 교류'}&apos; 약속
        </Text>
      </View>
      <View className="bg-white/15 rounded-full w-11 h-11 items-center justify-center ml-3">
        <Feather name="calendar" size={20} color="#fff" />
      </View>
    </View>
  );
}
