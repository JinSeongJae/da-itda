import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatListItem } from '../../../components/chat/ChatListItem';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChatStore } from '../../../store/useChatStore';
import { useUserStore } from '../../../store/useUserStore';

export default function ChatList() {
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const threadsById = useChatStore((s) => s.threadsById);
  const fetchThreads = useChatStore((s) => s.fetchThreads);
  const usersById = useUserStore((s) => s.usersById);
  const fetchAllUsers = useUserStore((s) => s.fetchAllUsers);

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
        <Text className="text-[28px] font-extrabold text-gray-900">채팅</Text>
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
              onPress={() => router.push(`/chatroom/${item.id}`)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            iconName="message-circle"
            title="아직 대화가 없어요"
            description="홈에서 매칭하기를 눌러 새로운 이웃을 만나보세요."
          />
        }
      />
    </SafeAreaView>
  );
}
