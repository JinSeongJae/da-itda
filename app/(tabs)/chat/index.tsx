import { useCallback } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
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
  const deleteThread = useChatStore((s) => s.deleteThread);
  const usersById = useUserStore((s) => s.usersById);
  const fetchAllUsers = useUserStore((s) => s.fetchAllUsers);
  const currentUser = usersById[currentUserId];

  // 상대방이 다른 기기에서 먼저 매칭·채팅을 시작하면 이 탭에 새 스레드가 생기는데, 마운트
  // 시 한 번만 불러오면 이 탭이 이미 떠있던 세션에선 반영이 안 된다 — 탭에 들어올 때마다
  // 새로고침한다.
  useFocusEffect(
    useCallback(() => {
      fetchThreads();
      fetchAllUsers();
    }, [fetchThreads, fetchAllUsers])
  );

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
              onLongPress={() =>
                Alert.alert(t('common.deleteConfirmTitle'), t('common.deleteConfirmBody'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.delete'), style: 'destructive', onPress: () => deleteThread(item.id) },
                ])
              }
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
