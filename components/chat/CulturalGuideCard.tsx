import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function CulturalGuideCard({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View className="self-center bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2 my-2 max-w-[85%]">
      <Pressable onPress={() => setExpanded((e) => !e)} className="flex-row items-center">
        <Feather name="info" size={14} color="#b45309" />
        <Text className="ml-1.5 text-amber-800 text-xs font-bold">AI 문화 맥락 가이드</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="#b45309"
          style={{ marginLeft: 6 }}
        />
      </Pressable>
      {expanded && <Text className="text-amber-800 text-xs mt-1.5 leading-4">{text}</Text>}
    </View>
  );
}
