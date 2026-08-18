import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { scoreColor } from '../../constants/theme';
import type { User } from '../../types';

export function RecommendedNeighborCard({
  candidate,
  compatibilityScore,
  onMatch,
  matching = false,
  topPick = false,
}: {
  candidate: User;
  compatibilityScore: number;
  onMatch: () => void;
  matching?: boolean;
  topPick?: boolean;
}) {
  const badgeColor = scoreColor(compatibilityScore);
  const topSkill = candidate.skillsOffered[0]?.label;

  return (
    <View className="flex-row items-center py-4 border-b border-gray-100">
      <Avatar uri={candidate.avatarUrl} size={52} />
      <View className="ml-3.5 flex-1">
        <View className="flex-row items-center">
          <Text className="text-[16px] font-bold text-gray-900">{candidate.name}</Text>
          {topPick && <Text className="text-[11px] font-bold text-primary-600 ml-1.5">TOP</Text>}
        </View>
        <Text className="text-[13px] text-gray-400 mt-0.5" numberOfLines={1}>
          {topSkill ? `${topSkill} 나눠줄 수 있어요` : `${candidate.location.district} · ${candidate.nationality}`}
        </Text>
      </View>

      <Text className="text-base font-extrabold mr-2.5" style={{ color: badgeColor }}>
        {compatibilityScore}%
      </Text>

      <Pressable
        onPress={onMatch}
        disabled={matching}
        className="rounded-full bg-primary-500 px-4 py-2.5 items-center justify-center active:bg-primary-600 min-w-[76px]"
      >
        {matching ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white text-[13px] font-bold">매칭하기</Text>
        )}
      </Pressable>
    </View>
  );
}
