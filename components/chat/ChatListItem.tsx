import { Pressable, Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';
import type { ChatThread, User } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

export function ChatListItem({
  thread,
  counterpart,
  onPress,
}: {
  thread: ChatThread;
  counterpart: User;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-3.5 active:bg-gray-50">
      <View className="rounded-full p-0.5 border border-gray-100">
        <Avatar uri={counterpart.avatarUrl} size={52} />
      </View>
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="text-base font-bold text-gray-800">{counterpart.name}</Text>
          {thread.isDirectChannel && <Tag label="단짝 이웃" tone="primary" />}
        </View>
        <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>
          {thread.lastMessagePreview ?? '대화를 시작해보세요'}
        </Text>
      </View>
      {thread.lastMessageAt && (
        <Text className="text-gray-400 text-xs">{formatRelativeTime(thread.lastMessageAt)}</Text>
      )}
    </Pressable>
  );
}
