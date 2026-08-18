import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export function QRDisplay({ token }: { token: string }) {
  return (
    <View className="items-center bg-gray-50 rounded-3xl p-6">
      <QRCode value={`daitda://checkin/${token}`} size={180} color="#111827" backgroundColor="#fff" />
      <Text className="text-gray-400 text-xs mt-4 tracking-widest">{token}</Text>
    </View>
  );
}
