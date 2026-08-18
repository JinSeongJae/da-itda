import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { Badge } from '../../types';
import { useTranslation } from '../../utils/i18n';

export function BadgeUnlockBanner({ badge }: { badge: Badge }) {
  const { t } = useTranslation();
  return (
    <View className="items-center py-6">
      <View className="w-32 h-32 rounded-full bg-primary-50 items-center justify-center mb-5">
        <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center">
          <Feather name={badge.iconName as any} size={38} color="#fff" />
        </View>
      </View>
      <Text className="text-2xl font-extrabold text-gray-800">{t('badgeUnlock.title', { name: badge.name })}</Text>
      <Text className="text-gray-500 text-center mt-2 px-8">{badge.description}</Text>
      <View className="bg-primary-50 rounded-2xl px-4 py-3 mt-5 mx-6">
        <Text className="text-primary-700 text-sm text-center font-medium">
          {t('badgeUnlock.directChannelInfo')}
        </Text>
      </View>
    </View>
  );
}
