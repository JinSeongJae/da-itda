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
}: {
  candidate: User;
  compatibilityScore: number;
  onMatch: () => void;
  matching?: boolean;
}) {
  return (
    <Card className="mb-3">
      <View className="flex-row items-center">
        <Avatar uri={candidate.avatarUrl} size={52} />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-gray-800">{candidate.name}</Text>
            <Text
              className="ml-2 text-xs font-extrabold"
              style={{ color: scoreColor(compatibilityScore) }}
            >
              AI {compatibilityScore}% 매칭
            </Text>
          </View>
          <View className="flex-row flex-wrap mt-1.5">
            {candidate.skillsOffered.slice(0, 2).map((s) => (
              <Tag key={s.id} label={s.label} tone="primary" />
            ))}
            {candidate.skillsWanted.slice(0, 1).map((s) => (
              <Tag key={s.id} label={`찾는 중 · ${s.label}`} tone="neutral" />
            ))}
          </View>
        </View>
      </View>
      <Button label="매칭하기" onPress={onMatch} loading={matching} disabled={matching} className="mt-3" />
    </Card>
  );
}
