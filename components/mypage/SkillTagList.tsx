import { Text, View } from 'react-native';
import { Tag } from '../common/Tag';
import type { Skill } from '../../types';

export function SkillTagList({
  title,
  skills,
  tone = 'primary',
}: {
  title: string;
  skills: Skill[];
  tone?: 'primary' | 'neutral';
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-bold text-gray-700 mb-2">{title}</Text>
      <View className="flex-row flex-wrap">
        {skills.length === 0 ? (
          <Text className="text-xs text-gray-400">아직 등록된 항목이 없어요.</Text>
        ) : (
          skills.map((s) => <Tag key={s.id} label={s.label} tone={tone} />)
        )}
      </View>
    </View>
  );
}
