import { useMemo, useState } from 'react';
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
import { useChatStore } from '../../store/useChatStore';
import { useMatchStore } from '../../store/useMatchStore';
import { useUserStore } from '../../store/useUserStore';
import { generateAppointmentSuggestion } from '../../utils/gemini';
import { formatDateTime } from '../../utils/formatters';

export default function AppointmentFormScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const usersById = useUserStore((s) => s.usersById);
  const thread = useChatStore((s) => s.threadsById[threadId]);
  const getMatchById = useMatchStore((s) => s.getMatchById);
  const recommendSafeZones = useAppointmentStore((s) => s.recommendSafeZones);
  const createAppointment = useAppointmentStore((s) => s.createAppointment);
  const attachAppointmentMessage = useChatStore((s) => s.attachAppointmentMessage);
  const messages = useChatStore((s) => s.messagesByThread[threadId] ?? []);
  const [aiSuggesting, setAiSuggesting] = useState(false);

  const match = thread ? getMatchById(thread.matchId) : undefined;
  const counterpartId = thread?.participantIds.find((id) => id !== currentUserId);
  const currentUser = usersById[currentUserId];
  const counterpart = counterpartId ? usersById[counterpartId] : undefined;

  const zones = useMemo(() => {
    if (!currentUser || !counterpart) return [];
    return recommendSafeZones(currentUser.location, counterpart.location);
  }, [currentUser, counterpart, recommendSafeZones]);

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
  const [safeZoneId, setSafeZoneId] = useState<string | null>(zones[0]?.id ?? null);
  const [purpose, setPurpose] = useState('');

  if (!thread || !match || !counterpart) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="약속 잡기" showBack />
        <Text className="text-center text-gray-500 mt-10">대화 정보를 찾을 수 없어요.</Text>
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

      setDate(parse(suggestion.date, 'yyyy-MM-dd', new Date()));
      setTime(parse(suggestion.time, 'HH:mm', new Date()));
      setPurpose(suggestion.purpose);
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
      `${formatDateTime(appointment.date, appointment.time)} · ${zone?.name ?? '안심존'}에서 만나요!${purposeText}`
    );

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="약속 잡기 (원터치)" showBack />
      <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 text-sm mb-5">
          {counterpart.name}님과의 만남을 날짜·시간·장소까지 한번에 정해보세요.
        </Text>

        {!!process.env.EXPO_PUBLIC_GEMINI_API_KEY && (
          <Button
            label={aiSuggesting ? 'AI가 약속을 추천하는 중...' : 'AI 약속 추천받기'}
            variant="secondary"
            loading={aiSuggesting}
            onPress={handleAiSuggest}
            className="mb-5"
          />
        )}

        <DateTimePickerField
          label="날짜"
          mode="date"
          value={date}
          onChange={setDate}
          displayText={format(date, 'yyyy년 M월 d일')}
        />
        <DateTimePickerField
          label="시간"
          mode="time"
          value={time}
          onChange={setTime}
          displayText={format(time, 'HH:mm')}
        />

        <SafeZonePicker
          zones={zones}
          selectedId={safeZoneId ?? zones[0]?.id ?? null}
          onSelect={setSafeZoneId}
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2 mt-1">약속 목적</Text>
        <TextInput
          value={purpose}
          onChangeText={setPurpose}
          placeholder="예: 생활 영어 & 아도보 요리 교류"
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-4"
        />

        <View className="bg-gray-50 rounded-2xl p-3.5 mt-2 mb-6">
          <Text className="text-xs text-gray-500">
            {formatDateTime(dateStr, timeStr)} · {selectedZone?.name ?? '장소를 선택해주세요'}
          </Text>
        </View>

        <Button label="약속 확정하기" onPress={handleConfirm} disabled={!selectedZone} />
      </ScrollView>
    </SafeAreaView>
  );
}
