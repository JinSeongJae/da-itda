import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppointmentSummaryCard } from './AppointmentSummaryCard';
import { CulturalGuideCard } from './CulturalGuideCard';
import { TranslationToggle } from './TranslationToggle';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useSafeZoneStore } from '../../store/useSafeZoneStore';
import type { ChatMessage } from '../../types';
import { formatTimeShort } from '../../utils/formatters';

export function MessageBubble({ message, isOwnMessage }: { message: ChatMessage; isOwnMessage: boolean }) {
  const getAppointmentById = useAppointmentStore((s) => s.getAppointmentById);
  const getSafeZoneById = useSafeZoneStore((s) => s.getSafeZoneById);

  if (message.type === 'system') {
    return (
      <Text className="text-center text-gray-400 text-xs my-2 px-8">{message.text}</Text>
    );
  }

  if (message.type === 'cultural-guide') {
    return <CulturalGuideCard text={message.text} />;
  }

  if (message.type === 'appointment' && message.appointmentId) {
    const appointment = getAppointmentById(message.appointmentId);
    const safeZone = appointment ? getSafeZoneById(appointment.safeZoneId) : undefined;
    if (!appointment) return null;
    return (
      <AppointmentSummaryCard
        appointment={appointment}
        safeZone={safeZone}
        onCheckIn={() => router.push(`/meetup/${appointment.id}/warning`)}
      />
    );
  }

  const translated = message.translatedText ? Object.values(message.translatedText)[0] : undefined;

  return (
    <View className={`my-1 max-w-[78%] ${isOwnMessage ? 'self-end items-end' : 'self-start items-start'}`}>
      <View
        className={`rounded-2xl px-3.5 py-2.5 ${isOwnMessage ? 'bg-primary-500 rounded-br-sm' : 'bg-gray-100 rounded-bl-sm'}`}
      >
        <TranslationToggle original={message.text} translated={translated} isOwnMessage={isOwnMessage} />
      </View>
      <Text className="text-gray-400 text-[10px] mt-1">{formatTimeShort(message.createdAt)}</Text>
    </View>
  );
}
