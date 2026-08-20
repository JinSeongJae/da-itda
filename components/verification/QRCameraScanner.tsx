import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Pressable, Text, View } from 'react-native';
import { Button } from '../common/Button';
import { useTranslation } from '../../utils/i18n';

export function QRCameraScanner({
  onScanned,
  onCancel,
}: {
  onScanned: (data: string) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [handled, setHandled] = useState(false);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View className="items-center bg-gray-50 rounded-2xl p-5 mt-4">
        <Text className="text-sm text-gray-500 text-center mb-3">{t('meetupQr.cameraPermissionNeeded')}</Text>
        <Button label={t('meetupQr.grantPermission')} onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View className="mt-4 rounded-2xl overflow-hidden relative" style={{ height: 320 }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={(result) => {
          if (handled) return;
          setHandled(true);
          onScanned(result.data);
        }}
      />
      <Pressable
        onPress={onCancel}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 items-center justify-center"
      >
        <Feather name="x" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}
