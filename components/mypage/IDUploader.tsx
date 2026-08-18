import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export function IDUploader({ onPicked }: { onPicked: (uri: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handlePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPreview(result.assets[0].uri);
      onPicked(result.assets[0].uri);
    }
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
          <Text className="text-sm text-gray-500 mt-2">신분증 · 외국인등록증 사진 업로드</Text>
        </>
      )}
    </Pressable>
  );
}
