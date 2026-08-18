import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AIContextHeader } from '../../components/chat/AIContextHeader';
import { ChatInputBar } from '../../components/chat/ChatInputBar';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { SmartReplySuggestions } from '../../components/chat/SmartReplySuggestions';
import { Avatar } from '../../components/common/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useUserStore } from '../../store/useUserStore';
import type { ChatMessage } from '../../types';

export default function Chatroom() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const usersById = useUserStore((s) => s.usersById);

  const thread = useChatStore((s) => s.threadsById[threadId]);
  const messages = useChatStore((s) => s.messagesByThread[threadId] ?? []);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const getContextHeader = useChatStore((s) => s.getContextHeader);
  const generateCounterpartReply = useChatStore((s) => s.generateCounterpartReply);
  const syncMessagesFromServer = useChatStore((s) => s.syncMessagesFromServer);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [aiReplying, setAiReplying] = useState(false);

  useEffect(() => {
    syncMessagesFromServer(threadId);
  }, [threadId]);

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

  const handleSend = async (text: string) => {
    sendMessage(threadId, currentUserId, text);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));

    setAiReplying(true);
    await generateCounterpartReply(threadId, counterpartId);
    setAiReplying(false);
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
        <SmartReplySuggestions
          suggestions={smartReplySuggestions}
          onSelect={handleSend}
          loading={aiReplying}
          loadingLabel={`${counterpart?.name ?? '이웃'}님이 답장을 작성 중이에요...`}
        />
        <ChatInputBar onSend={handleSend} onOpenAppointment={() => router.push(`/appointment/${threadId}`)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
