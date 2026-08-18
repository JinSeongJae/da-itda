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
    <View className="flex-row items-center justify-between px-6 py-4 bg-white">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable onPress={() => router.back()} hitSlop={12} className="mr-3 -ml-1">
            <Feather name="chevron-left" size={26} color="#111827" />
          </Pressable>
        )}
        <Text className="text-xl font-extrabold text-gray-900" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
