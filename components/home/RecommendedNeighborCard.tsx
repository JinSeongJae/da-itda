import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { scoreColor } from '../../constants/theme';
import type { User } from '../../types';
import { useTranslation } from '../../utils/i18n';

export function RecommendedNeighborCard({
  candidate,
  compatibilityScore,
  onMatch,
  matching = false,
  topPick = false,
  aiRationale,
}: {
  candidate: User;
  compatibilityScore: number;
  onMatch: () => void;
  matching?: boolean;
  topPick?: boolean;
  aiRationale?: string;
}) {
  const { t, skillLabel } = useTranslation();
  const badgeColor = scoreColor(compatibilityScore);
  const topSkill = candidate.skillsOffered[0];

  return (
    <View className="py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        <Avatar uri={candidate.avatarUrl} size={52} />
        <View className="ml-3.5 flex-1">
          <View className="flex-row items-center">
            <Text className="text-[16px] font-bold text-gray-900">{candidate.name}</Text>
            {topPick && (
              <Text className="text-[11px] font-bold text-primary-600 ml-1.5">{t('neighborCard.top')}</Text>
            )}
          </View>
          <Text className="text-[13px] text-gray-400 mt-0.5" numberOfLines={1}>
            {topSkill
              ? t('neighborCard.offers', {
                  skill: topSkill.emoji ? `${topSkill.emoji} ${skillLabel(topSkill)}` : skillLabel(topSkill),
                })
              : `${candidate.location.district} · ${candidate.nationality}`}
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
            <Text className="text-white text-[13px] font-bold">{t('neighborCard.matchButton')}</Text>
          )}
        </Pressable>
      </View>

      {!!aiRationale && (
        <View className="flex-row items-start bg-primary-50 rounded-xl px-3 py-2 mt-2.5 ml-[64px]">
          <Feather name="cpu" size={12} color="#047857" style={{ marginTop: 1 }} />
          <Text className="text-[11px] text-primary-700 ml-1.5 flex-1 leading-4">{aiRationale}</Text>
        </View>
      )}
    </View>
  );
}
