import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from '../../utils/i18n';

export interface PickedIdPhoto {
  previewUri: string;
  base64: string;
  mimeType: string;
}

export function IDUploader({ onPicked }: { onPicked: (photo: PickedIdPhoto) => void }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);

  const handlePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    // 신분증 사진은 얼굴/번호가 잘 보여야 AI가 번호 위치를 찾아 가릴 수 있어서 압축을 세게 하지 않는다.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    if (!asset.base64) return;
    setPreview(asset.uri);
    // 여기서는 절대 업로드하지 않는다 — 서버가 AI로 번호를 찾아 가린 뒤에만 저장되어야 한다.
    onPicked({ previewUri: asset.uri, base64: asset.base64, mimeType: asset.mimeType ?? 'image/jpeg' });
  };

  return (
    <Pressable
      onPress={handlePick}
      className="border-2 border-dashed border-gray-300 rounded-2xl items-center justify-center py-8 bg-gray-50"
    >
      {preview ? (
        <Image source={{ uri: preview }} style={{ width: '100%', height: 160, borderRadius: 12 }} resizeMode="cover" />
      ) : (
        <>
          <Feather name="upload" size={26} color="#9ca3af" />
          <Text className="text-sm text-gray-500 mt-2">{t('uploader.placeholder')}</Text>
        </>
      )}
    </Pressable>
  );
}
