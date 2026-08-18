import { useEffect, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AIContextHeader } from '../../components/chat/AIContextHeader';
import { ChatInputBar } from '../../components/chat/ChatInputBar';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { SmartReplySuggestions } from '../../components/chat/SmartReplySuggestions';
import { Avatar } from '../../components/common/Avatar';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useUserStore } from '../../store/useUserStore';
import type { ChatMessage } from '../../types';

const POLL_INTERVAL_MS = 4000;

export default function Chatroom() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const usersById = useUserStore((s) => s.usersById);

  const thread = useChatStore((s) => s.threadsById[threadId]);
  const messages = useChatStore((s) => s.messagesByThread[threadId] ?? []);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const getContextHeader = useChatStore((s) => s.getContextHeader);
  const syncMessagesFromServer = useChatStore((s) => s.syncMessagesFromServer);
  const fetchAppointments = useAppointmentStore((s) => s.fetchAppointments);

  const listRef = useRef<FlatList<ChatMessage>>(null);

  // 상대방이 실제 사람이라 답장이 언제 올지 모른다 — 화면이 떠 있는 동안 주기적으로 새 메시지를 가져온다.
  useEffect(() => {
    syncMessagesFromServer(threadId);
    const interval = setInterval(() => syncMessagesFromServer(threadId), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [threadId, syncMessagesFromServer]);

  // 상대방이 약속을 잡았을 수도 있으니, 채팅 카드/체크인이 보이도록 내 약속 목록도 받아온다.
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (!thread) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">대화방을 찾을 수 없어요.</Text>
      </SafeAreaView>
    );
  }

  const counterpartId = thread.participantIds.find((id) => id !== currentUserId)!;
  const counterpart = usersById[counterpartId];
  const contextHeader = getContextHeader(thread.matchId);

  const smartReplySuggestions = counterpart
    ? [
        counterpart.skillsOffered[0] && `${counterpart.skillsOffered[0].label} 알려주실 수 있나요?`,
        counterpart.skillsWanted[0] && `${counterpart.skillsWanted[0].label}은 제가 도와드릴 수 있어요!`,
        '이번 주에 시간 괜찮으신 날 있으세요?',
      ].filter((s): s is string => Boolean(s))
    : [];

  const handleSend = (text: string) => {
    sendMessage(threadId, currentUserId, text);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-row items-center px-3 py-2 border-b border-gray-100">
        <Pressable onPress={() => router.back()} hitSlop={12} className="mr-1">
          <Feather name="chevron-left" size={24} color="#111827" />
        </Pressable>
        {counterpart && <Avatar uri={counterpart.avatarUrl} size={36} />}
        <Text className="ml-2 text-base font-bold text-gray-800 flex-1" numberOfLines={1}>
          {counterpart?.name ?? '대화 상대'}
          {thread.isDirectChannel ? ' · 단짝 이웃' : ''}
        </Text>
      </View>

      {contextHeader && <AIContextHeader data={contextHeader} />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 12, flexGrow: 1 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <MessageBubble message={item} isOwnMessage={item.senderId === currentUserId} />
          )}
        />
        <SmartReplySuggestions suggestions={smartReplySuggestions} onSelect={handleSend} />
        <ChatInputBar onSend={handleSend} onOpenAppointment={() => router.push(`/appointment/${threadId}`)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
