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
    <View className="flex-row items-center justify-between px-4 py-3.5 bg-white shadow-sm shadow-gray-200">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-2 active:bg-gray-100"
          >
            <Feather name="chevron-left" size={22} color="#111827" />
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
