import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from '../../utils/i18n';

export function ChatInputBar({ onSend }: { onSend: (text: string) => void }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View className="flex-row items-center px-3 py-2 border-t border-gray-100 bg-white">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={t('chatroom.inputPlaceholder')}
        placeholderTextColor="#9ca3af"
        className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-800 mr-2"
        multiline
      />
      <Pressable
        onPress={handleSend}
        disabled={!text.trim()}
        className={`w-9 h-9 rounded-full items-center justify-center ${text.trim() ? 'bg-primary-500' : 'bg-gray-200'}`}
      >
        <Feather name="arrow-up" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}
