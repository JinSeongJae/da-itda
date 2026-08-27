import { useCallback, useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { format, parse } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePickerField } from '../../components/appointment/DateTimePickerField';
import { SafeZonePicker } from '../../components/appointment/SafeZonePicker';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { EMPTY_MESSAGES, useChatStore } from '../../store/useChatStore';
import { useMatchStore } from '../../store/useMatchStore';
import { useUserStore } from '../../store/useUserStore';
import { generateAppointmentSuggestion } from '../../utils/gemini';
import { formatDateTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';
import type { RankedSafeZone } from '../../types';

export default function AppointmentFormScreen() {
  const { t } = useTranslation();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const usersById = useUserStore((s) => s.usersById);
  const thread = useChatStore((s) => s.threadsById[threadId]);
  const getMatchById = useMatchStore((s) => s.getMatchById);
  const recommendSafeZonesWithAI = useAppointmentStore((s) => s.recommendSafeZonesWithAI);
  const createAppointment = useAppointmentStore((s) => s.createAppointment);
  const attachAppointmentMessage = useChatStore((s) => s.attachAppointmentMessage);
  const messages = useChatStore((s) => s.messagesByThread[threadId] ?? EMPTY_MESSAGES);
  const [aiSuggesting, setAiSuggesting] = useState(false);

  const match = thread ? getMatchById(thread.matchId) : undefined;
  const counterpartId = thread?.participantIds.find((id) => id !== currentUserId);
  const currentUser = usersById[currentUserId];
  const counterpart = counterpartId ? usersById[counterpartId] : undefined;

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  });
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(10, 0, 0, 0);
    return d;
  });
  const [zones, setZones] = useState<RankedSafeZone[]>([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [safeZoneId, setSafeZoneId] = useState<string | null>(null);
  const [purpose, setPurpose] = useState('');

  const loadSafeZones = useCallback(
    async (override?: { date: Date; time: Date }) => {
      if (!currentUser || !counterpart) return;
      setZonesLoading(true);
      try {
        const ranked = await recommendSafeZonesWithAI({
          userA: currentUser,
          userB: counterpart,
          meetingDate: format(override?.date ?? date, 'yyyy-MM-dd'),
          meetingTime: format(override?.time ?? time, 'HH:mm'),
        });
        setZones(ranked);
        setSafeZoneId((prev) => (prev && ranked.some((z) => z.id === prev) ? prev : ranked[0]?.id ?? null));
      } finally {
        setZonesLoading(false);
      }
    },
    [currentUser, counterpart, date, time, recommendSafeZonesWithAI]
  );

  useEffect(() => {
    loadSafeZones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, counterpart?.id]);

  if (!thread || !match || !counterpart) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('appointmentForm.title')} showBack />
        <Text className="text-center text-gray-500 mt-10">{t('appointmentForm.notFound')}</Text>
      </SafeAreaView>
    );
  }

  if (currentUser && currentUser.verification !== 'verified') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('appointmentForm.title')} showBack />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-gray-500 leading-6">{t('chatroom.verificationRequiredBody')}</Text>
          <Button
            label={t('chatroom.verificationRequiredConfirm')}
            className="mt-5"
            onPress={() => router.replace('/(tabs)/mypage/verification')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const selectedZone = zones.find((z) => z.id === (safeZoneId ?? zones[0]?.id));
  const dateStr = format(date, 'yyyy-MM-dd');
  const timeStr = format(time, 'HH:mm');

  const handleAiSuggest = async () => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return;

    setAiSuggesting(true);
    try {
      const conversationText = messages
        .filter((m) => m.type === 'text')
        .slice(-15)
        .map((m) => `${m.senderId === currentUserId ? currentUser.name : counterpart.name}: ${m.text}`)
        .join('\n');

      const systemInstruction =
        `당신은 이웃 교류 앱 '다잇다'의 약속 추천 도우미입니다. ` +
        `${currentUser.name}님(줄 수 있어요: ${currentUser.skillsOffered.map((s) => s.label).join(', ')}, ` +
        `받고 싶어요: ${currentUser.skillsWanted.map((s) => s.label).join(', ')})와 ` +
        `${counterpart.name}님(줄 수 있어요: ${counterpart.skillsOffered.map((s) => s.label).join(', ')}, ` +
        `받고 싶어요: ${counterpart.skillsWanted.map((s) => s.label).join(', ')})의 만남을 추천해주세요.`;

      const suggestion = await generateAppointmentSuggestion({
        apiKey,
        systemInstruction,
        conversationText: conversationText || '(아직 나눈 대화가 없어요)',
      });

      const suggestedDate = parse(suggestion.date, 'yyyy-MM-dd', new Date());
      const suggestedTime = parse(suggestion.time, 'HH:mm', new Date());
      setDate(suggestedDate);
      setTime(suggestedTime);
      setPurpose(suggestion.purpose);
      loadSafeZones({ date: suggestedDate, time: suggestedTime });
    } catch {
      // 조용히 무시 — 사용자가 직접 입력을 이어갈 수 있음
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleConfirm = () => {
    const finalZoneId = safeZoneId ?? zones[0]?.id;
    if (!finalZoneId) return;

    const trimmedPurpose = purpose.trim();
    const appointment = createAppointment({
      matchId: match.id,
      threadId,
      date: dateStr,
      time: timeStr,
      safeZoneId: finalZoneId,
      purpose: trimmedPurpose || undefined,
      createdBy: currentUserId,
    });

    const zone = zones.find((z) => z.id === finalZoneId);
    const purposeText = trimmedPurpose ? ` · '${trimmedPurpose}'` : '';
    attachAppointmentMessage(
      thread.id,
      appointment.id,
      `${formatDateTime(appointment.date, appointment.time)} · ${zone?.name ?? t('appointmentCard.defaultZone')}에서 만나요!${purposeText}`
    );

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('appointmentForm.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 text-sm mb-5">
          {t('appointmentForm.subtitle', { name: counterpart.name })}
        </Text>

        {!!process.env.EXPO_PUBLIC_GEMINI_API_KEY && (
          <Button
            label={aiSuggesting ? t('appointmentForm.aiSuggesting') : t('appointmentForm.aiSuggestButton')}
            variant="secondary"
            loading={aiSuggesting}
            onPress={handleAiSuggest}
            className="mb-5"
          />
        )}

        <DateTimePickerField
          label={t('appointmentForm.dateLabel')}
          mode="date"
          value={date}
          onChange={setDate}
          displayText={format(date, 'yyyy년 M월 d일')}
        />
        <DateTimePickerField
          label={t('appointmentForm.timeLabel')}
          mode="time"
          value={time}
          onChange={setTime}
          displayText={format(time, 'HH:mm')}
        />

        <SafeZonePicker
          zones={zones}
          selectedId={safeZoneId ?? zones[0]?.id ?? null}
          onSelect={setSafeZoneId}
          loading={zonesLoading}
          onRefresh={loadSafeZones}
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2 mt-1">{t('appointmentForm.purposeLabel')}</Text>
        <TextInput
          value={purpose}
          onChangeText={setPurpose}
          placeholder={t('appointmentForm.purposePlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-4"
        />

        <View className="flex-row items-center bg-primary-50 rounded-2xl p-3.5 mt-2 mb-6">
          <Feather name="check-circle" size={14} color="#059669" />
          <Text className="text-xs text-primary-700 font-medium ml-2 flex-1">
            {formatDateTime(dateStr, timeStr)} · {selectedZone?.name ?? t('appointmentForm.pickPlace')}
          </Text>
        </View>

        <Button label={t('appointmentForm.confirmButton')} onPress={handleConfirm} disabled={!selectedZone} />
      </ScrollView>
    </SafeAreaView>
  );
}
