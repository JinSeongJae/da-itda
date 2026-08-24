import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import type { TranslationKey } from '../../constants/i18n';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import { useTranslation } from '../../utils/i18n';

const SECTION_KEYS: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'terms.section1Title', body: 'terms.section1Body' },
  { title: 'terms.section2Title', body: 'terms.section2Body' },
  { title: 'terms.section3Title', body: 'terms.section3Body' },
  { title: 'terms.section4Title', body: 'terms.section4Body' },
  { title: 'terms.section5Title', body: 'terms.section5Body' },
  { title: 'terms.section6Title', body: 'terms.section6Body' },
];

export default function Terms() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const updateProfile = useUserStore((s) => s.updateProfile);
  const [checked, setChecked] = useState(false);

  const handleContinue = () => {
    updateProfile(currentUserId, { termsAcceptedAt: new Date().toISOString() });
    router.replace('/(onboarding)/interest-selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('terms.title')} />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 mb-5 leading-5">{t('terms.intro')}</Text>

        {SECTION_KEYS.map(({ title, body }) => (
          <View key={title} className="mb-4">
            <Text className="text-sm font-bold text-gray-800 mb-1.5">{t(title)}</Text>
            <Text className="text-xs text-gray-500 leading-5">{t(body)}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => setChecked((c) => !c)}
          className="flex-row items-center mt-2 mb-2 bg-gray-50 rounded-2xl p-4"
        >
          <View
            className={`w-5 h-5 rounded-md border-2 items-center justify-center mr-3 ${checked ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}
          >
            {checked && <Feather name="check" size={13} color="#fff" />}
          </View>
          <Text className="text-sm text-gray-700 flex-1">{t('terms.checkboxLabel')}</Text>
        </Pressable>
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        {!checked && <Text className="text-xs text-gray-400 text-center mb-2">{t('terms.mustAgreeHint')}</Text>}
        <Button label={t('terms.continueButton')} onPress={handleContinue} disabled={!checked} />
      </View>
    </SafeAreaView>
  );
}
