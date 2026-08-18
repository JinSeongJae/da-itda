import { Pressable, Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';
import type { ChatThread, User } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';

export function ChatListItem({
  thread,
  counterpart,
  onPress,
}: {
  thread: ChatThread;
  counterpart: User;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-4">
      <Avatar uri={counterpart.avatarUrl} size={52} />
      <View className="ml-3.5 flex-1">
        <View className="flex-row items-center">
          <Text className="text-[16px] font-bold text-gray-900">{counterpart.name}</Text>
          {thread.isDirectChannel && <Tag label={t('chat.directChannelTag')} tone="primary" />}
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
