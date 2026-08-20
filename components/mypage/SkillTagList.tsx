import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Tag } from '../common/Tag';
import type { Skill } from '../../types';
import { useTranslation } from '../../utils/i18n';

const COLLAPSED_COUNT = 2;

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
  const [expanded, setExpanded] = useState(false);
  const hasMore = skills.length > COLLAPSED_COUNT;
  const visible = expanded ? skills : skills.slice(0, COLLAPSED_COUNT);

  return (
    <View className="mb-4">
      <Text className="text-sm font-bold text-gray-700 mb-2">{title}</Text>
      <View className="flex-row flex-wrap items-center">
        {skills.length === 0 ? (
          <Text className="text-xs text-gray-400">{t('mypage.noItems')}</Text>
        ) : (
          <>
            {visible.map((s) => (
              <Tag key={s.id} label={skillLabel(s)} tone={tone} />
            ))}
            {hasMore && (
              <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={6} className="px-1.5 py-1">
                <Text className="text-xs font-bold text-gray-400">
                  {expanded ? t('mypage.showLess') : '···'}
                </Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
}
