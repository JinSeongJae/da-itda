import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Appointment, SafeZone } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export function AppointmentSummaryCard({
  appointment,
  safeZone,
  onCheckIn,
}: {
  appointment: Appointment;
  safeZone?: SafeZone;
  onCheckIn: () => void;
}) {
  return (
    <View className="self-center bg-white border border-gray-200 rounded-2xl p-4 my-2 max-w-[90%] w-72">
      <View className="flex-row items-center mb-2">
        <Feather name="calendar" size={16} color="#10b981" />
        <Text className="ml-2 text-sm font-bold text-gray-800">약속이 확정되었어요</Text>
      </View>
      <Text className="text-sm text-gray-700">{formatDateTime(appointment.date, appointment.time)}</Text>
      <View className="flex-row items-center mt-1">
        <Feather name="map-pin" size={13} color="#9ca3af" />
        <Text className="text-xs text-gray-500 ml-1">{safeZone?.name ?? '안심존'}</Text>
      </View>
      {!!appointment.purpose && (
        <Text className="text-xs text-gray-600 mt-1">목적 · {appointment.purpose}</Text>
      )}
      {safeZone && (
        <Text className="text-xs text-primary-600 mt-1">AI 안심 지수 {safeZone.safetyScore}점</Text>
      )}
      <Pressable onPress={onCheckIn} className="bg-primary-500 rounded-xl py-2.5 items-center mt-3">
        <Text className="text-white text-sm font-semibold">현장 체크인 하러 가기</Text>
      </Pressable>
    </View>
  );
}
