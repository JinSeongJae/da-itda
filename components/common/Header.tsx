import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function Header({ title, showBack = false, right }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable onPress={() => router.back()} hitSlop={12} className="mr-2">
            <Feather name="chevron-left" size={24} color="#111827" />
          </Pressable>
        )}
        <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
