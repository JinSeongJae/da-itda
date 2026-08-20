import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { ScrollView, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { LanguagePicker } from '../../components/common/LanguagePicker';
import { ALL_SKILLS, groupSkillsByCategory, SKILL_CATEGORY_ORDER } from '../../mocks/skills';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import type { Gender, Skill, TalkStyle } from '../../types';
import { useTranslation } from '../../utils/i18n';
import type { TranslationKey } from '../../constants/i18n';

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

function SkillChip({
  skill,
  selected,
  onToggle,
}: {
  skill: Skill;
  selected: boolean;
  onToggle: () => void;
}) {
  const { skillLabel } = useTranslation();
  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-center rounded-full px-3.5 py-2.5 mr-2 mb-2 border ${
        selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-200'
      }`}
    >
      {selected && <Feather name="check" size={12} color="#fff" style={{ marginRight: 4 }} />}
      <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-gray-700'}`}>
        {skillLabel(skill)}
      </Text>
    </Pressable>
  );
}

function GroupedSkillChips({
  skills: skillPool,
  selectedIds,
  onToggle,
}: {
  skills: Skill[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const { t } = useTranslation();
  const grouped = groupSkillsByCategory(skillPool);
  return (
    <>
      {SKILL_CATEGORY_ORDER.map((category) => {
        const skills = grouped[category];
        if (!skills || skills.length === 0) return null;
        return (
          <View key={category} className="mb-1">
            <Text className="text-[11px] font-semibold text-gray-400 mb-2">
              {t(`skillCategory.${category}` as TranslationKey)}
            </Text>
            <View className="flex-row flex-wrap mb-2">
              {skills.map((skill) => (
                <SkillChip
                  key={skill.id}
                  skill={skill}
                  selected={selectedIds.includes(skill.id)}
                  onToggle={() => onToggle(skill.id)}
                />
              ))}
            </View>
          </View>
        );
      })}
    </>
  );
}

export default function InterestSelection() {
  const { t, skillLabel } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const existingUser = useUserStore((s) => (currentUserId ? s.usersById[currentUserId] : undefined));

  const [name, setName] = useState(existingUser?.name ?? '');
  const [offeredIds, setOfferedIds] = useState<string[]>([]);
  const [wantedIds, setWantedIds] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender>(existingUser?.gender ?? 'unspecified');
  const [talkStyle, setTalkStyle] = useState<TalkStyle>(existingUser?.talkStyle ?? 'no-preference');
  const [skillSearch, setSkillSearch] = useState('');

  const filteredSkills = skillSearch.trim()
    ? ALL_SKILLS.filter((s) => skillLabel(s).toLowerCase().includes(skillSearch.trim().toLowerCase()))
    : ALL_SKILLS;

  const toggle = (setFn: typeof setOfferedIds, id: string) =>
    setFn((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const canSave = name.trim().length > 0 && offeredIds.length > 0 && wantedIds.length > 0;

  const handleSave = () => {
    if (!currentUserId) return;

    const skillsOffered = ALL_SKILLS.filter((s) => offeredIds.includes(s.id));
    const skillsWanted = ALL_SKILLS.filter((s) => wantedIds.includes(s.id));

    updateProfile(currentUserId, {
      name: name.trim(),
      gender,
      talkStyle,
      skillsOffered,
      skillsWanted,
      availability: [
        { day: '화', start: '15:00', end: '18:00' },
        { day: '토', start: '10:00', end: '13:00' },
      ],
    });
    router.replace('/(onboarding)/location-setup');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('interestSelection.title')} showBack right={<LanguagePicker />} />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 mb-5 leading-5">{t('interestSelection.subtitle')}</Text>

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('interestSelection.nameLabel')}</Text>
        <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 mb-6">
          <Feather name="user" size={16} color="#9ca3af" />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('interestSelection.namePlaceholder')}
            placeholderTextColor="#9ca3af"
            className="flex-1 py-3.5 ml-2 text-base text-gray-800"
          />
        </View>

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

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700">{t('interestSelection.offeredLabel')}</Text>
          <Text className="text-xs text-gray-400">
            {t('interestSelection.selectedCount', { count: offeredIds.length })}
          </Text>
        </View>
        <Text className="text-xs text-gray-400 mb-3">{t('interestSelection.offeredHint')}</Text>
        <View className="mb-4">
          <GroupedSkillChips
            skills={filteredSkills}
            selectedIds={offeredIds}
            onToggle={(id) => toggle(setOfferedIds, id)}
          />
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700">{t('interestSelection.wantedLabel')}</Text>
          <Text className="text-xs text-gray-400">
            {t('interestSelection.selectedCount', { count: wantedIds.length })}
          </Text>
        </View>
        <Text className="text-xs text-gray-400 mb-3">{t('interestSelection.wantedHint')}</Text>
        <View className="mb-1">
          <GroupedSkillChips
            skills={filteredSkills}
            selectedIds={wantedIds}
            onToggle={(id) => toggle(setWantedIds, id)}
          />
        </View>

        <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">{t('profileFields.genderLabel')}</Text>
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

        <Text className="text-sm font-semibold text-gray-700 mb-1 mt-3">{t('profileFields.talkStyleLabel')}</Text>
        <Text className="text-xs text-gray-400 mb-2">{t('profileFields.talkStyleHint')}</Text>
        <View className="flex-row flex-wrap mb-2">
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
        {!canSave && (
          <Text className="text-xs text-gray-400 text-center mb-2">
            {t('interestSelection.validationHint')}
          </Text>
        )}
        <Button label={t('interestSelection.saveButton')} onPress={handleSave} disabled={!canSave} />
      </View>
    </SafeAreaView>
  );
}
