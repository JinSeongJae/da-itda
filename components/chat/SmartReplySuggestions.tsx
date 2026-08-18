import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

export function SmartReplySuggestions({
  suggestions,
  onSelect,
  loading = false,
  loadingLabel,
}: {
  suggestions: string[];
  onSelect: (text: string) => void;
  loading?: boolean;
  loadingLabel?: string;
}) {
  if (suggestions.length === 0 && !loading) return null;

  return (
    <View className="h-16 max-h-24 mb-2 bg-white border-t border-gray-100 justify-center">
      {loading ? (
        <View className="flex-row items-center px-4">
          <ActivityIndicator size="small" color="#10b981" />
          <Text className="ml-2 text-xs text-gray-400" numberOfLines={1}>
            {loadingLabel ?? '답장을 작성 중이에요...'}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row flex-nowrap overflow-x-auto overflow-y-hidden"
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            paddingHorizontal: 12,
          }}
        >
          {suggestions.map((text) => (
            <Pressable
              key={text}
              onPress={() => onSelect(text)}
              className="px-3 py-2 rounded-full bg-primary-50 border border-primary-100 mr-2"
            >
              <Text className="text-xs font-medium text-primary-700" numberOfLines={1}>
                {text}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
