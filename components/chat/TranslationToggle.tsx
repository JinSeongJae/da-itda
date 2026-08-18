import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '../../utils/i18n';

export function TranslationToggle({
  original,
  translated,
  isOwnMessage,
}: {
  original: string;
  translated?: string;
  isOwnMessage: boolean;
}) {
  const { t } = useTranslation();
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <View>
      <Text className={isOwnMessage ? 'text-white' : 'text-gray-800'}>
        {showTranslation && translated ? translated : original}
      </Text>
      {!!translated && (
        <Pressable onPress={() => setShowTranslation((v) => !v)} className="flex-row items-center mt-1">
          <Feather name="globe" size={11} color={isOwnMessage ? '#d1fae5' : '#6b7280'} />
          <Text className={`text-[11px] ml-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-500'}`}>
            {showTranslation ? t('chatroom.viewOriginal') : t('chatroom.viewTranslation')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
