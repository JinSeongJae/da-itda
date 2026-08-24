import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePickerField } from '../../components/appointment/DateTimePickerField';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { useAuthStore } from '../../store/useAuthStore';
import { useMatchStore } from '../../store/useMatchStore';
import { useTranslation } from '../../utils/i18n';

export default function NewMicroGroupScreen() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const createMicroGroup = useMatchStore((s) => s.createMicroGroup);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('6');
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

  const maxParticipantsNum = Number.parseInt(maxParticipants, 10);
  const canSubmit =
    title.trim().length > 0 &&
    location.trim().length > 0 &&
    category.trim().length > 0 &&
    Number.isFinite(maxParticipantsNum) &&
    maxParticipantsNum > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
    await createMicroGroup(currentUserId, {
      title: title.trim(),
      location: location.trim(),
      category: category.trim(),
      maxParticipants: maxParticipantsNum,
      date: combined.toISOString(),
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('newGroup.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('newGroup.titleLabel')}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('newGroup.titlePlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-5"
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('newGroup.locationLabel')}</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder={t('newGroup.locationPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-5"
        />

        <DateTimePickerField
          label={t('newGroup.dateLabel')}
          mode="date"
          value={date}
          onChange={setDate}
          displayText={format(date, 'yyyy년 M월 d일')}
        />
        <DateTimePickerField
          label={t('newGroup.timeLabel')}
          mode="time"
          value={time}
          onChange={setTime}
          displayText={format(time, 'HH:mm')}
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('newGroup.categoryLabel')}</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder={t('newGroup.categoryPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-5"
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('newGroup.maxParticipantsLabel')}</Text>
        <TextInput
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          keyboardType="number-pad"
          placeholder={t('newGroup.maxParticipantsPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-2"
        />
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        {!canSubmit && <Text className="text-xs text-gray-400 text-center mb-2">{t('newGroup.validationHint')}</Text>}
        <Button label={t('newGroup.submitButton')} disabled={!canSubmit} onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}
