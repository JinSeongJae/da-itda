import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import { ALL_SKILLS, groupSkillsByCategory, SKILL_CATEGORY_ORDER } from '../../../mocks/skills';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUserStore } from '../../../store/useUserStore';
import type { Gender, Skill, TalkStyle } from '../../../types';
import { useTranslation } from '../../../utils/i18n';
import { uploadImage } from '../../../utils/upload';
import type { TranslationKey } from '../../../constants/i18n';

const GENDER_OPTIONS: { value: Gender; key: TranslationKey }[] = [
  { value: 'female', key: 'profileFields.genderFemale' },
  { value: 'male', key: 'profileFields.genderMale' },
  { value: 'unspecified', key: 'profileFields.genderUnspecified' },
];

const TALK_STYLE_OPTIONS: { value: TalkStyle; key: TranslationKey }[] = [
  { value: 'quiet', key: 'profileFields.talkStyleQuiet' },
  { value: 'lively', key: 'profileFields.talkStyleLively' },
  { value: 'no-preference', key: 'profileFields.talkStyleNoPreference' },
];

function OptionChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-3.5 py-2 mr-2 mb-2 border ${
        selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-200'
      }`}
    >
      <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
    </Pressable>
  );
}

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

function GroupedAddableChips({ skills, onAdd }: { skills: Skill[]; onAdd: (skill: Skill) => void }) {
  const { t } = useTranslation();
  const grouped = groupSkillsByCategory(skills);
  return (
    <>
      {SKILL_CATEGORY_ORDER.map((category) => {
        const categorySkills = grouped[category];
        if (!categorySkills || categorySkills.length === 0) return null;
        return (
          <View key={category} className="mb-1">
            <Text className="text-[11px] font-semibold text-gray-400 mb-2">
              {t(`skillCategory.${category}` as TranslationKey)}
            </Text>
            <View className="flex-row flex-wrap mb-2">
              {categorySkills.map((skill) => (
                <AddableChip key={skill.id} skill={skill} onAdd={() => onAdd(skill)} />
              ))}
            </View>
          </View>
        );
      })}
    </>
  );
}

export default function EditProfile() {
  const { t, skillLabel } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const user = useUserStore((s) => s.usersById[currentUserId]);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const addSkillOffered = useUserStore((s) => s.addSkillOffered);
  const removeSkillOffered = useUserStore((s) => s.removeSkillOffered);
  const addSkillWanted = useUserStore((s) => s.addSkillWanted);
  const removeSkillWanted = useUserStore((s) => s.removeSkillWanted);

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [gender, setGender] = useState<Gender>(user?.gender ?? 'unspecified');
  const [talkStyle, setTalkStyle] = useState<TalkStyle>(user?.talkStyle ?? 'no-preference');
  const [skillSearch, setSkillSearch] = useState('');

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    // 즉시 로컬 미리보기로 반영하고, 업로드가 끝나면 실제 서버 URL로 교체한다 —
    // 그래야 다른 유저 기기에서도 새 프로필 사진이 보인다(로컬 file:// URI는 나만 볼 수 있음).
    updateProfile(currentUserId, { avatarUrl: asset.uri });
    if (asset.base64) {
      const url = await uploadImage(asset.base64, asset.mimeType ?? 'image/jpeg');
      if (url) updateProfile(currentUserId, { avatarUrl: url });
    }
  };

  if (!user) return null;

  const offeredIds = new Set(user.skillsOffered.map((s) => s.id));
  const wantedIds = new Set(user.skillsWanted.map((s) => s.id));
  const searchQuery = skillSearch.trim().toLowerCase();
  const matchesSearch = (s: Skill) => !searchQuery || skillLabel(s).toLowerCase().includes(searchQuery);
  const availableToOffer = ALL_SKILLS.filter((s) => !offeredIds.has(s.id) && matchesSearch(s));
  const availableToWant = ALL_SKILLS.filter((s) => !wantedIds.has(s.id) && matchesSearch(s));

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

        <Text className="text-sm font-bold text-gray-700 mb-2">{t('interestSelection.nameLabel')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('interestSelection.namePlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-6"
        />

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

        <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 mb-4">
          <Feather name="search" size={15} color="#9ca3af" />
          <TextInput
            value={skillSearch}
            onChangeText={setSkillSearch}
            placeholder={t('skillSearch.placeholder')}
            placeholderTextColor="#9ca3af"
            className="flex-1 py-3 ml-2 text-sm text-gray-800"
          />
        </View>

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
        <View className="mb-4">
          <GroupedAddableChips skills={availableToOffer} onAdd={(s) => addSkillOffered(currentUserId, s)} />
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
        <View className="mb-4">
          <GroupedAddableChips skills={availableToWant} onAdd={(s) => addSkillWanted(currentUserId, s)} />
        </View>

        <Text className="text-sm font-bold text-gray-700 mb-2">{t('profileFields.genderLabel')}</Text>
        <View className="flex-row flex-wrap mb-1">
          {GENDER_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.value}
              label={t(opt.key)}
              selected={gender === opt.value}
              onPress={() => setGender(opt.value)}
            />
          ))}
        </View>

        <Text className="text-sm font-bold text-gray-700 mb-1 mt-3">{t('profileFields.talkStyleLabel')}</Text>
        <Text className="text-xs text-gray-400 mb-2">{t('profileFields.talkStyleHint')}</Text>
        <View className="flex-row flex-wrap mb-8">
          {TALK_STYLE_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.value}
              label={t(opt.key)}
              selected={talkStyle === opt.value}
              onPress={() => setTalkStyle(opt.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        <Button
          label={t('edit.save')}
          disabled={name.trim().length === 0}
          onPress={() => updateProfile(currentUserId, { name: name.trim(), bio, gender, talkStyle })}
        />
      </View>
    </SafeAreaView>
  );
}
