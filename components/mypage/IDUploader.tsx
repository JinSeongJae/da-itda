import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../utils/upload';
import { useTranslation } from '../../utils/i18n';

export function IDUploader({ onPicked }: { onPicked: (uri: string) => void }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setPreview(asset.uri);

    if (!asset.base64) {
      onPicked(asset.uri);
      return;
    }

    setUploading(true);
    const url = await uploadImage(asset.base64, asset.mimeType ?? 'image/jpeg');
    setUploading(false);
    // 업로드 실패 시에도 흐름을 막지 않도록 로컬 URI로 폴백 — 다만 그 경우 다른 기기(심사자)에게는
    // 보이지 않을 수 있음을 감안한다.
    onPicked(url ?? asset.uri);
  };

  return (
    <Pressable
      onPress={handlePick}
      disabled={uploading}
      className="border-2 border-dashed border-gray-300 rounded-2xl items-center justify-center py-8 bg-gray-50"
    >
      {preview ? (
        <View style={{ width: '100%' }}>
          <Image source={{ uri: preview }} style={{ width: '100%', height: 160, borderRadius: 12 }} resizeMode="cover" />
          {uploading && (
            <View className="absolute inset-0 items-center justify-center bg-black/20 rounded-xl">
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>
      ) : (
        <>
          <Feather name="upload" size={26} color="#9ca3af" />
          <Text className="text-sm text-gray-500 mt-2">{t('uploader.placeholder')}</Text>
        </>
      )}
    </Pressable>
  );
}
