import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { BADGES } from '../../mocks/badges';
import type { BadgeId } from '../../types';

export function BadgeGrid({ earnedBadgeIds }: { earnedBadgeIds: BadgeId[] }) {
  const allBadges = Object.values(BADGES);

  return (
    <View className="flex-row flex-wrap px-5">
      {allBadges.map((badge) => {
        const earned = earnedBadgeIds.includes(badge.id);
        return (
          <View key={badge.id} className="w-1/2 p-2">
            <View
              className={`items-center rounded-2xl p-4 ${earned ? 'bg-primary-50' : 'bg-gray-50 opacity-50'}`}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${earned ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <Feather name={badge.iconName as any} size={20} color="#fff" />
              </View>
              <Text className="text-xs font-bold text-gray-800 text-center">{badge.name}</Text>
              <Text className="text-[10px] text-gray-500 text-center mt-1" numberOfLines={2}>
                {badge.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
