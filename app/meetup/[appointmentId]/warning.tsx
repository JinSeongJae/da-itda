import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import type { TranslationKey } from '../../../constants/i18n';
import { useTranslation } from '../../../utils/i18n';

const NOTICE_KEYS: TranslationKey[] = [
  'meetupWarning.item1',
  'meetupWarning.item2',
  'meetupWarning.item3',
  'meetupWarning.item4',
];

export default function MeetupWarning() {
  const { t } = useTranslation();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const [checked, setChecked] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('meetupWarning.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="items-center mb-5">
          <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-3">
            <Feather name="alert-triangle" size={28} color="#b45309" />
          </View>
          <Text className="text-lg font-extrabold text-gray-800">{t('meetupWarning.headline')}</Text>
        </View>

        {NOTICE_KEYS.map((key, i) => (
          <View key={i} className="flex-row items-start mb-3.5">
            <View className="w-5 h-5 rounded-full bg-amber-100 items-center justify-center mr-2.5 mt-0.5">
              <Text className="text-amber-700 text-[10px] font-bold">{i + 1}</Text>
            </View>
            <Text className="text-sm text-gray-700 flex-1 leading-5">{t(key)}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => setChecked((c) => !c)}
          className="flex-row items-center mt-6 mb-5 bg-gray-50 rounded-2xl p-4"
        >
          <View
            className={`w-5 h-5 rounded-md border-2 items-center justify-center mr-3 ${checked ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}
          >
            {checked && <Feather name="check" size={13} color="#fff" />}
          </View>
          <Text className="text-sm text-gray-700 flex-1">{t('meetupWarning.checkbox')}</Text>
        </Pressable>

        <Button
          label={t('meetupWarning.continue')}
          disabled={!checked}
          onPress={() => router.push(`/meetup/${appointmentId}/qr`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
