import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header';
import { CULTURAL_PIN_CATEGORY_META } from '../../constants/theme';
import { useCulturalMapStore } from '../../store/useCulturalMapStore';
import type { CulturalPin } from '../../types';
import { useTranslation } from '../../utils/i18n';

// A real MapView (react-native-maps) needs a Google Maps API key configured for standalone
// Android builds, which this app doesn't have set up — rendering it without one crashes on
// device. Every other geo feature in this app (SafeZonePicker, etc.) is list-based for the
// same reason, so this follows suit instead of taking on a Maps API key as a new dependency.
function PinRow({ pin, onPress }: { pin: CulturalPin; onPress: () => void }) {
  const meta = CULTURAL_PIN_CATEGORY_META[pin.category];
  return (
    <Pressable onPress={onPress} className="flex-row items-center border border-gray-100 rounded-2xl p-3.5 mb-2.5">
      <View className="w-9 h-9 rounded-full bg-primary-100 items-center justify-center mr-3">
        <Feather name={(meta?.iconName as any) ?? 'map-pin'} size={16} color="#047857" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
          {pin.title}
        </Text>
        <Text className="text-xs text-gray-500" numberOfLines={1}>
          {meta?.label} · {pin.address ?? ''}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color="#d1d5db" />
    </Pressable>
  );
}

export default function CulturalMapScreen() {
  const { t } = useTranslation();
  const pinsById = useCulturalMapStore((s) => s.pinsById);
  const fetchPins = useCulturalMapStore((s) => s.fetchPins);
  const pins = Object.values(pinsById);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const openPin = (pin: CulturalPin) => router.push(`/cultural-map/${pin.id}`);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('culturalMap.title')} showBack />

      <View className="flex-1">
        <FlatList
          data={pins}
          keyExtractor={(pin) => pin.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          renderItem={({ item }) => <PinRow pin={item} onPress={() => openPin(item)} />}
          ListEmptyComponent={<Text className="text-sm text-gray-400 text-center mt-10">{t('culturalMap.empty')}</Text>}
        />
      </View>

      <Pressable
        onPress={() => router.push('/cultural-map/new')}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary-500 items-center justify-center shadow-lg"
      >
        <Feather name="plus" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}
