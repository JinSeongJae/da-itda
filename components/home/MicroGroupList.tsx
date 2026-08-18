import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Card } from '../common/Card';
import type { MicroGroupSuggestion } from '../../types';
import { formatDate } from '../../utils/formatters';

interface Props {
  groups: MicroGroupSuggestion[];
  currentUserId: string;
  onToggleInterest: (groupId: string) => void;
}

export function MicroGroupList({ groups, currentUserId, onToggleInterest }: Props) {
  return (
    <View className="mt-4">
      <View className="flex-row items-center mb-3">
        <Feather name="users" size={18} color="#10b981" />
        <Text className="ml-2 text-base font-bold text-gray-800">AI 추천 동네 소모임</Text>
      </View>
      {groups.map((group) => {
        const isInterested = group.interestedUserIds.includes(currentUserId);
        return (
          <Card key={group.id} className="mb-3">
            <Text className="text-sm font-semibold text-gray-800">{group.title}</Text>
            <View className="flex-row items-center mt-2">
              <Feather name="map-pin" size={13} color="#9ca3af" />
              <Text className="text-xs text-gray-500 ml-1">{group.location}</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Feather name="calendar" size={13} color="#9ca3af" />
              <Text className="text-xs text-gray-500 ml-1">{formatDate(group.date)}</Text>
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-xs text-gray-400">
                관심 {group.interestedUserIds.length}/{group.maxParticipants}명
              </Text>
              <Pressable
                onPress={() => onToggleInterest(group.id)}
                className={`px-3 py-1.5 rounded-full ${isInterested ? 'bg-primary-500' : 'bg-gray-100'}`}
              >
                <Text className={`text-xs font-semibold ${isInterested ? 'text-white' : 'text-gray-600'}`}>
                  {isInterested ? '참여 신청됨' : '관심 있어요'}
                </Text>
              </Pressable>
            </View>
          </Card>
        );
      })}
    </View>
  );
}
