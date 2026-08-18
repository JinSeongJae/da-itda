import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import { ALL_SKILLS } from '../../../mocks/skills';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUserStore } from '../../../store/useUserStore';
import type { Skill } from '../../../types';

function RemovableTag({ skill, onRemove }: { skill: Skill; onRemove: () => void }) {
  return (
    <View className="flex-row items-center bg-primary-100 rounded-full pl-3 pr-1.5 py-1 mr-2 mb-2">
      <Text className="text-xs font-medium text-primary-700 mr-1">{skill.label}</Text>
      <Pressable onPress={onRemove} hitSlop={6}>
        <Feather name="x" size={13} color="#047857" />
      </Pressable>
    </View>
  );
}

function AddableChip({ skill, onAdd }: { skill: Skill; onAdd: () => void }) {
  return (
    <Pressable onPress={onAdd} className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
      <Feather name="plus" size={12} color="#6b7280" />
      <Text className="text-xs text-gray-600 ml-1">{skill.label}</Text>
    </Pressable>
  );
}

export default function EditProfile() {
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const user = useUserStore((s) => s.usersById[currentUserId]);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const addSkillOffered = useUserStore((s) => s.addSkillOffered);
  const removeSkillOffered = useUserStore((s) => s.removeSkillOffered);
  const addSkillWanted = useUserStore((s) => s.addSkillWanted);
  const removeSkillWanted = useUserStore((s) => s.removeSkillWanted);

  const [bio, setBio] = useState(user?.bio ?? '');

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      updateProfile(currentUserId, { avatarUrl: result.assets[0].uri });
    }
  };

  if (!user) return null;

  const offeredIds = new Set(user.skillsOffered.map((s) => s.id));
  const wantedIds = new Set(user.skillsWanted.map((s) => s.id));
  const availableToOffer = ALL_SKILLS.filter((s) => !offeredIds.has(s.id));
  const availableToWant = ALL_SKILLS.filter((s) => !wantedIds.has(s.id));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="프로필 수정" showBack />
      <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="items-center mb-6">
          <Pressable onPress={handlePickAvatar} className="relative">
            <Avatar uri={user.avatarUrl} size={88} />
            <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-500 items-center justify-center border-2 border-white">
              <Feather name="camera" size={13} color="#fff" />
            </View>
          </Pressable>
          <Text className="text-xs text-gray-500 mt-2">탭해서 프로필 사진 변경</Text>
        </View>

        <Text className="text-sm font-bold text-gray-700 mb-2">소개</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          placeholder="이웃들에게 나를 짧게 소개해보세요"
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-6"
          textAlignVertical="top"
        />

        <Text className="text-sm font-bold text-gray-700 mb-1">줄 수 있어요</Text>
        <Text className="text-xs text-gray-400 mb-2.5">태그를 눌러 빼거나, 아래에서 더 추가해보세요</Text>
        <View className="flex-row flex-wrap mb-2">
          {user.skillsOffered.length === 0 ? (
            <Text className="text-xs text-gray-400 mb-2">아직 등록된 항목이 없어요</Text>
          ) : (
            user.skillsOffered.map((s) => (
              <RemovableTag key={s.id} skill={s} onRemove={() => removeSkillOffered(currentUserId, s.id)} />
            ))
          )}
        </View>
        <View className="flex-row flex-wrap mb-6">
          {availableToOffer.map((s) => (
            <AddableChip key={s.id} skill={s} onAdd={() => addSkillOffered(currentUserId, s)} />
          ))}
        </View>

        <Text className="text-sm font-bold text-gray-700 mb-1">받고 싶어요</Text>
        <Text className="text-xs text-gray-400 mb-2.5">태그를 눌러 빼거나, 아래에서 더 추가해보세요</Text>
        <View className="flex-row flex-wrap mb-2">
          {user.skillsWanted.length === 0 ? (
            <Text className="text-xs text-gray-400 mb-2">아직 등록된 항목이 없어요</Text>
          ) : (
            user.skillsWanted.map((s) => (
              <RemovableTag key={s.id} skill={s} onRemove={() => removeSkillWanted(currentUserId, s.id)} />
            ))
          )}
        </View>
        <View className="flex-row flex-wrap mb-8">
          {availableToWant.map((s) => (
            <AddableChip key={s.id} skill={s} onAdd={() => addSkillWanted(currentUserId, s)} />
          ))}
        </View>
      </ScrollView>

      <View className="px-5 pt-3 pb-4 border-t border-gray-100 bg-white">
        <Button label="저장하기" onPress={() => updateProfile(currentUserId, { bio })} />
      </View>
    </SafeAreaView>
  );
}
