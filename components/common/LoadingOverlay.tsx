import { ActivityIndicator, Modal, Text, View } from 'react-native';

export function LoadingOverlay({ visible, label }: { visible: boolean; label: string }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="bg-white rounded-3xl px-8 py-8 items-center w-64">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="mt-4 text-base font-semibold text-gray-800 text-center">{label}</Text>
        </View>
      </View>
    </Modal>
  );
}
