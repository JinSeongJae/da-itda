import { Text, View } from 'react-native';
import { Tag } from '../common/Tag';
import type { Skill } from '../../types';
import { useTranslation } from '../../utils/i18n';

export function SkillTagList({
  title,
  skills,
  tone = 'primary',
}: {
  title: string;
  skills: Skill[];
  tone?: 'primary' | 'neutral';
}) {
  const { t, skillLabel } = useTranslation();
  return (
    <View className="mb-4">
      <Text className="text-sm font-bold text-gray-700 mb-2">{title}</Text>
      <View className="flex-row flex-wrap">
        {skills.length === 0 ? (
          <Text className="text-xs text-gray-400">{t('mypage.noItems')}</Text>
        ) : (
          skills.map((s) => <Tag key={s.id} label={skillLabel(s)} tone={tone} />)
        )}
      </View>
    </View>
  );
}
