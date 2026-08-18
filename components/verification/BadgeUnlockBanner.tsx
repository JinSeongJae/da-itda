import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { Badge } from '../../types';

export function BadgeUnlockBanner({ badge }: { badge: Badge }) {
  return (
    <View className="items-center py-6">
      <View className="w-32 h-32 rounded-full bg-primary-50 items-center justify-center mb-5">
        <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center">
          <Feather name={badge.iconName as any} size={38} color="#fff" />
        </View>
      </View>
      <Text className="text-2xl font-extrabold text-gray-800">{badge.name} 뱃지 획득!</Text>
      <Text className="text-gray-500 text-center mt-2 px-8">{badge.description}</Text>
      <View className="bg-primary-50 rounded-2xl px-4 py-3 mt-5 mx-6">
        <Text className="text-primary-700 text-sm text-center font-medium">
          이제부터 AI 매칭 절차 없이{'\n'}1:1 다이렉트 채널로 자유롭게 대화할 수 있어요.
        </Text>
      </View>
    </View>
  );
}
