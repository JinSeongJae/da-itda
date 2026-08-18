import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { AIContextHeaderData } from '../../types';
import { useTranslation } from '../../utils/i18n';

export function AIContextHeader({ data }: { data: AIContextHeaderData }) {
  const { t } = useTranslation();
  return (
    <View className="bg-primary-50 px-6 py-3 flex-row items-start">
      <Feather name="cpu" size={16} color="#047857" style={{ marginTop: 2 }} />
      <View className="ml-2 flex-1">
        <Text className="text-primary-800 text-xs font-semibold">
          {t('chatroom.aiContextLabel', { score: data.compatibilityScore })}
        </Text>
        <Text className="text-primary-700 text-xs mt-0.5">{data.purposeSummary}</Text>
      </View>
    </View>
  );
}
