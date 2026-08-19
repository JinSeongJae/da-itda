import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { CULTURAL_PIN_CATEGORY_META } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useCulturalMapStore } from '../../store/useCulturalMapStore';
import type { CulturalPinCategory } from '../../types';
import { useTranslation } from '../../utils/i18n';
import type { TranslationKey } from '../../constants/i18n';

const CATEGORIES = Object.keys(CULTURAL_PIN_CATEGORY_META) as CulturalPinCategory[];

function CategoryChip({
  category,
  selected,
  onPress,
}: {
  category: CulturalPinCategory;
  selected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-3.5 py-2 mr-2 mb-2 border ${
        selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-200'
      }`}
    >
      <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-gray-700'}`}>
        {t(`culturalMap.category.${category}` as TranslationKey)}
      </Text>
    </Pressable>
  );
}

export default function NewCulturalPin() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const createPin = useCulturalMapStore((s) => s.createPin);

  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<CulturalPinCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = title.trim().length > 0 && story.trim().length > 0 && !!category;

  const handleSubmit = async () => {
    if (!canSubmit || !category) return;
    setSubmitting(true);
    setError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(t('culturalMap.locationPermissionDenied'));
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

      createPin({
        authorId: currentUserId,
        title: title.trim(),
        story: story.trim(),
        category,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: address.trim() || undefined,
      });

      router.back();
    } catch {
      setError(t('culturalMap.locationFetchFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('culturalMap.newPinTitle')} showBack />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 mb-5 leading-5">{t('culturalMap.newPinSubtitle')}</Text>

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('culturalMap.titleLabel')}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('culturalMap.titlePlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3.5 text-base text-gray-800 mb-5"
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('culturalMap.storyLabel')}</Text>
        <TextInput
          value={story}
          onChangeText={setStory}
          multiline
          numberOfLines={4}
          placeholder={t('culturalMap.storyPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-gray-800 mb-5"
          textAlignVertical="top"
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('culturalMap.categoryLabel')}</Text>
        <View className="flex-row flex-wrap mb-5">
          {CATEGORIES.map((c) => (
            <CategoryChip key={c} category={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('culturalMap.addressLabel')}</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder={t('culturalMap.addressPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-gray-800 mb-3"
        />
        <View className="flex-row items-start mb-5">
          <Feather name="map-pin" size={13} color="#9ca3af" style={{ marginTop: 2 }} />
          <Text className="text-xs text-gray-400 ml-1.5 flex-1 leading-4">{t('culturalMap.currentLocationHint')}</Text>
        </View>

        {!!error && (
          <View className="flex-row items-center bg-red-50 rounded-2xl px-4 py-3 mb-4">
            <Feather name="alert-circle" size={15} color="#ef4444" />
            <Text className="text-red-500 text-xs ml-2 flex-1">{error}</Text>
          </View>
        )}
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        <Button
          label={submitting ? t('culturalMap.submitting') : t('culturalMap.submitButton')}
          onPress={handleSubmit}
          loading={submitting}
          disabled={!canSubmit || submitting}
        />
      </View>
    </SafeAreaView>
  );
}
