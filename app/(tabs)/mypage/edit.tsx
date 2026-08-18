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
import { useTranslation } from '../../../utils/i18n';

function RemovableTag({ skill, onRemove }: { skill: Skill; onRemove: () => void }) {
  const { skillLabel } = useTranslation();
  return (
    <View className="flex-row items-center bg-primary-100 rounded-full pl-3 pr-1.5 py-1 mr-2 mb-2">
      <Text className="text-xs font-medium text-primary-700 mr-1">{skillLabel(skill)}</Text>
      <Pressable onPress={onRemove} hitSlop={6}>
        <Feather name="x" size={13} color="#047857" />
      </Pressable>
    </View>
  );
}

function AddableChip({ skill, onAdd }: { skill: Skill; onAdd: () => void }) {
  const { skillLabel } = useTranslation();
  return (
    <Pressable onPress={onAdd} className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
      <Feather name="plus" size={12} color="#6b7280" />
      <Text className="text-xs text-gray-600 ml-1">{skillLabel(skill)}</Text>
    </Pressable>
  );
}

export default function EditProfile() {
  const { t } = useTranslation();
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
      <Header title={t('edit.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="items-center mb-6">
          <Pressable onPress={handlePickAvatar} className="relative">
            <Avatar uri={user.avatarUrl} size={88} />
            <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-500 items-center justify-center border-2 border-white">
              <Feather name="camera" size={13} color="#fff" />
            </View>
          </Pressable>
          <Text className="text-xs text-gray-500 mt-2">{t('edit.changePhoto')}</Text>
        </View>

        <Text className="text-sm font-bold text-gray-700 mb-2">{t('edit.bioLabel')}</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          placeholder={t('edit.bioPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-6"
          textAlignVertical="top"
        />

        <Text className="text-sm font-bold text-gray-700 mb-1">{t('mypage.offeredLabel')}</Text>
        <Text className="text-xs text-gray-400 mb-2.5">{t('edit.tagHint')}</Text>
        <View className="flex-row flex-wrap mb-2">
          {user.skillsOffered.length === 0 ? (
            <Text className="text-xs text-gray-400 mb-2">{t('mypage.noItems')}</Text>
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

        <Text className="text-sm font-bold text-gray-700 mb-1">{t('mypage.wantedLabel')}</Text>
        <Text className="text-xs text-gray-400 mb-2.5">{t('edit.tagHint')}</Text>
        <View className="flex-row flex-wrap mb-2">
          {user.skillsWanted.length === 0 ? (
            <Text className="text-xs text-gray-400 mb-2">{t('mypage.noItems')}</Text>
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

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        <Button label={t('edit.save')} onPress={() => updateProfile(currentUserId, { bio })} />
      </View>
    </SafeAreaView>
  );
}
