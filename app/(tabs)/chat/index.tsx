import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatListItem } from '../../../components/chat/ChatListItem';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChatStore } from '../../../store/useChatStore';
import { useUserStore } from '../../../store/useUserStore';
import { useTranslation } from '../../../utils/i18n';

export default function ChatList() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const threadsById = useChatStore((s) => s.threadsById);
  const fetchThreads = useChatStore((s) => s.fetchThreads);
  const usersById = useUserStore((s) => s.usersById);
  const fetchAllUsers = useUserStore((s) => s.fetchAllUsers);
  const currentUser = usersById[currentUserId];

  useEffect(() => {
    fetchThreads();
    fetchAllUsers();
  }, [fetchThreads, fetchAllUsers]);

  const threads = Object.values(threadsById)
    .filter((t) => t.participantIds.includes(currentUserId))
    .sort((a, b) => (b.lastMessageAt ?? b.createdAt).localeCompare(a.lastMessageAt ?? a.createdAt));

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="px-6 pt-6 pb-2">
        <Text className="text-[28px] font-extrabold text-gray-900">{t('tabs.chat')}</Text>
      </View>
      <FlatList
        data={threads}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
        renderItem={({ item }) => {
          const counterpartId = item.participantIds.find((id) => id !== currentUserId);
          const counterpart = counterpartId ? usersById[counterpartId] : undefined;
          if (!counterpart) return null;
          return (
            <ChatListItem
              thread={item}
              counterpart={counterpart}
              isBestFriendNeighbor={currentUser?.bestFriendNeighborIds?.includes(counterpart.id)}
              onPress={() => router.push(`/chatroom/${item.id}`)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            iconName="message-circle"
            title={t('chat.emptyTitle')}
            description={t('chat.emptyDescription')}
          />
        }
      />
    </SafeAreaView>
  );
}
