import { Pressable, Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';
import type { ChatThread, User } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';

export function ChatListItem({
  thread,
  counterpart,
  isBestFriendNeighbor,
  onPress,
  onLongPress,
}: {
  thread: ChatThread;
  counterpart: User;
  isBestFriendNeighbor?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={400} className="flex-row items-center py-4">
      <Avatar uri={counterpart.avatarUrl} size={52} />
      <View className="ml-3.5 flex-1">
        <View className="flex-row items-center">
          <Text className="text-[16px] font-bold text-gray-900">{counterpart.name}</Text>
          {/* isDirectChannel은 기기 로컬 값이라 재설치 시 사라질 수 있어, 프로필에 동기화되는
              bestFriendNeighborIds도 함께 확인해 더 안정적으로 태그를 보여준다. */}
          {(thread.isDirectChannel || isBestFriendNeighbor) && (
            <Tag label={t('chat.directChannelTag')} tone="primary" />
          )}
        </View>
        <Text className="text-gray-400 text-[13px] mt-0.5" numberOfLines={1}>
          {thread.lastMessagePreview ?? t('chat.startConversation')}
        </Text>
      </View>
      {thread.lastMessageAt && (
        <Text className="text-gray-300 text-xs">{formatRelativeTime(thread.lastMessageAt)}</Text>
      )}
    </Pressable>
  );
}
