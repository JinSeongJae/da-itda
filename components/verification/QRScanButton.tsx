import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text } from 'react-native';

export function QRScanButton({ onScanned, disabled }: { onScanned: () => void; disabled?: boolean }) {
  const [scanning, setScanning] = useState(false);

  const handlePress = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onScanned();
    }, 1000);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || scanning}
      className={`flex-row items-center justify-center rounded-2xl py-3.5 mt-4 ${disabled ? 'bg-gray-200' : 'bg-primary-500'}`}
    >
      {scanning ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Feather name="camera" size={18} color="#fff" style={{ marginRight: 8 }} />
      )}
      <Text className="text-white text-base font-semibold ml-2">
        {scanning ? '스캔 중...' : 'QR 스캔하여 체크인'}
      </Text>
    </Pressable>
  );
}
