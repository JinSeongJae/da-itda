import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Card } from '../common/Card';
import type { MicroGroupSuggestion } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';

interface Props {
  groups: MicroGroupSuggestion[];
  currentUserId: string;
  onToggleInterest: (groupId: string) => void;
}

export function MicroGroupList({ groups, currentUserId, onToggleInterest }: Props) {
  const { t } = useTranslation();
  return (
    <View className="mt-8">
      <Text className="text-[13px] font-semibold text-gray-400 mb-1">{t('microGroup.aiLabel')}</Text>
      <Text className="text-xl font-extrabold text-gray-900 mb-3">{t('microGroup.title')}</Text>
      {groups.map((group) => {
        const isInterested = group.interestedUserIds.includes(currentUserId);
        return (
          <Card key={group.id} className="mb-3">
            <Text className="text-[15px] font-bold text-gray-900">{group.title}</Text>
            <View className="flex-row items-center mt-2">
              <Feather name="map-pin" size={13} color="#9ca3af" />
              <Text className="text-[13px] text-gray-500 ml-1">{group.location}</Text>
              <Text className="text-[13px] text-gray-300 mx-1.5">·</Text>
              <Feather name="calendar" size={13} color="#9ca3af" />
              <Text className="text-[13px] text-gray-500 ml-1">{formatDate(group.date)}</Text>
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-[13px] text-gray-400">
                {t('microGroup.interestCount', {
                  count: group.interestedUserIds.length,
                  max: group.maxParticipants,
                })}
              </Text>
              <Pressable
                onPress={() => onToggleInterest(group.id)}
                className={`px-3.5 py-2 rounded-full ${isInterested ? 'bg-primary-500' : 'bg-white'}`}
              >
                <Text className={`text-[13px] font-bold ${isInterested ? 'text-white' : 'text-gray-700'}`}>
                  {isInterested ? t('microGroup.joined') : t('microGroup.join')}
                </Text>
              </Pressable>
            </View>
          </Card>
        );
      })}
    </View>
  );
}
