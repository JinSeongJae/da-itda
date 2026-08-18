import { Feather } from '@expo/vector-icons';
import { Image, View } from 'react-native';

export function Avatar({ uri, size = 48 }: { uri?: string; size?: number }) {
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="overflow-hidden bg-gray-200 items-center justify-center"
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />
      ) : (
        <Feather name="user" size={size * 0.5} color="#9ca3af" />
      )}
    </View>
  );
}
