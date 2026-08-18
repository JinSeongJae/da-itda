import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function EmptyState({
  iconName = 'inbox',
  title,
  description,
}: {
  iconName?: keyof typeof Feather.glyphMap;
  title: string;
  description?: string;
}) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Feather name={iconName} size={28} color="#9ca3af" />
      </View>
      <Text className="text-base font-semibold text-gray-700 text-center">{title}</Text>
      {description && (
        <Text className="text-sm text-gray-400 text-center mt-1">{description}</Text>
      )}
    </View>
  );
}
