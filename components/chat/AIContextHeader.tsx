import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { AIContextHeaderData } from '../../types';

export function AIContextHeader({ data }: { data: AIContextHeaderData }) {
  return (
    <View className="bg-primary-50 px-6 py-3 flex-row items-start">
      <Feather name="cpu" size={16} color="#047857" style={{ marginTop: 2 }} />
      <View className="ml-2 flex-1">
        <Text className="text-primary-800 text-xs font-semibold">
          AI 매칭 목적 · 호환 지수 {data.compatibilityScore}%
        </Text>
        <Text className="text-primary-700 text-xs mt-0.5">{data.purposeSummary}</Text>
      </View>
    </View>
  );
}
