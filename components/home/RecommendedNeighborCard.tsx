import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
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

  return (
    <Card className={`mb-3 ${topPick ? 'border-primary-200' : ''}`}>
      {topPick && (
        <View className="flex-row items-center self-start bg-primary-50 rounded-full px-2.5 py-1 -mt-1 mb-2.5">
          <Feather name="award" size={11} color="#059669" />
          <Text className="text-primary-700 text-[11px] font-extrabold ml-1">AI 추천 1위</Text>
        </View>
      )}
      <View className="flex-row items-center">
        <View className="rounded-full p-0.5" style={{ borderWidth: 2, borderColor: badgeColor + '33' }}>
          <Avatar uri={candidate.avatarUrl} size={56} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-800">{candidate.name}</Text>
          <Text className="text-xs text-gray-400 mt-0.5">
            {candidate.location.district} · {candidate.nationality}
          </Text>
        </View>
        <View className="rounded-full px-2.5 py-1 flex-row items-center" style={{ backgroundColor: badgeColor + '1a' }}>
          <Feather name="zap" size={11} color={badgeColor} />
          <Text className="text-xs font-extrabold ml-1" style={{ color: badgeColor }}>
            {compatibilityScore}%
          </Text>
        </View>
      </View>
      <View className="flex-row flex-wrap mt-3">
        {candidate.skillsOffered.slice(0, 2).map((s) => (
          <Tag key={s.id} label={s.label} tone="primary" />
        ))}
        {candidate.skillsWanted.slice(0, 1).map((s) => (
          <Tag key={s.id} label={`찾는 중 · ${s.label}`} tone="neutral" />
        ))}
      </View>
      <Button label="매칭하기" onPress={onMatch} loading={matching} disabled={matching} className="mt-2" />
    </Card>
  );
}
