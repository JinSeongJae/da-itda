import { useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import type { TranslationKey } from '../../constants/i18n';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../utils/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES: { icon: keyof typeof Feather.glyphMap; title: TranslationKey; body: TranslationKey }[] = [
  { icon: 'users', title: 'tutorial.slide1Title', body: 'tutorial.slide1Body' },
  { icon: 'message-circle', title: 'tutorial.slide2Title', body: 'tutorial.slide2Body' },
  { icon: 'shield', title: 'tutorial.slide3Title', body: 'tutorial.slide3Body' },
  { icon: 'map', title: 'tutorial.slide4Title', body: 'tutorial.slide4Body' },
];

export default function Tutorial() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const finish = () => {
    completeOnboarding(currentUserId);
    router.replace('/(tabs)');
  };

  const goTo = (next: number) => {
    scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    setIndex(next);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable onPress={finish} hitSlop={8}>
          <Text className="text-sm text-gray-400 font-medium">{t('tutorial.skip')}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        className="flex-1"
      >
        {SLIDES.map((slide) => (
          <View key={slide.title} style={{ width: SCREEN_WIDTH }} className="items-center justify-center px-10">
            <View className="w-24 h-24 rounded-full bg-primary-50 items-center justify-center mb-8">
              <Feather name={slide.icon} size={40} color="#059669" />
            </View>
            <Text className="text-[22px] font-extrabold text-gray-900 text-center mb-3">{t(slide.title)}</Text>
            <Text className="text-sm text-gray-500 text-center leading-6">{t(slide.body)}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center justify-center mb-6">
        {SLIDES.map((slide, i) => (
          <View
            key={slide.title}
            className={`h-1.5 rounded-full mx-1 ${i === index ? 'w-6 bg-primary-500' : 'w-1.5 bg-gray-200'}`}
          />
        ))}
      </View>

      <View className="px-6 pb-4">
        <Button
          label={isLast ? t('tutorial.start') : t('tutorial.next')}
          onPress={() => (isLast ? finish() : goTo(index + 1))}
        />
      </View>
    </SafeAreaView>
  );
}
