import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { ScrollView, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { ALL_SKILLS } from '../../mocks/skills';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import type { Skill } from '../../types';

function SkillChip({
  skill,
  selected,
  onToggle,
}: {
  skill: Skill;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-center rounded-full px-3.5 py-2.5 mr-2 mb-2 border ${
        selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-200'
      }`}
    >
      {selected && <Feather name="check" size={12} color="#fff" style={{ marginRight: 4 }} />}
      <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-gray-700'}`}>
        {skill.label}
      </Text>
    </Pressable>
  );
}

export default function InterestSelection() {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const existingUser = useUserStore((s) => (currentUserId ? s.usersById[currentUserId] : undefined));

  const [name, setName] = useState(existingUser?.name ?? '');
  const [offeredIds, setOfferedIds] = useState<string[]>([]);
  const [wantedIds, setWantedIds] = useState<string[]>([]);

  const toggle = (setFn: typeof setOfferedIds, id: string) =>
    setFn((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const canSave = name.trim().length > 0 && offeredIds.length > 0 && wantedIds.length > 0;

  const handleSave = () => {
    if (!currentUserId) return;

    const skillsOffered = ALL_SKILLS.filter((s) => offeredIds.includes(s.id));
    const skillsWanted = ALL_SKILLS.filter((s) => wantedIds.includes(s.id));

    updateProfile(currentUserId, {
      name: name.trim(),
      skillsOffered,
      skillsWanted,
      availability: [
        { day: '화', start: '15:00', end: '18:00' },
        { day: '토', start: '10:00', end: '13:00' },
      ],
    });
    completeOnboarding(currentUserId);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="관심사 설정" showBack />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 mb-5 leading-5">
          이름과 관심사를 알려주시면 AI가 딱 맞는 이웃을 찾아드려요.
        </Text>

        <Text className="text-sm font-semibold text-gray-700 mb-2">이름</Text>
        <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 mb-6">
          <Feather name="user" size={16} color="#9ca3af" />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="이웃들에게 보여질 이름"
            placeholderTextColor="#9ca3af"
            className="flex-1 py-3.5 ml-2 text-base text-gray-800"
          />
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700">줄 수 있어요</Text>
          <Text className="text-xs text-gray-400">{offeredIds.length}개 선택됨</Text>
        </View>
        <Text className="text-xs text-gray-400 mb-3">내가 이웃에게 나눠줄 수 있는 재능을 골라주세요</Text>
        <View className="flex-row flex-wrap mb-5">
          {ALL_SKILLS.map((skill) => (
            <SkillChip
              key={skill.id}
              skill={skill}
              selected={offeredIds.includes(skill.id)}
              onToggle={() => toggle(setOfferedIds, skill.id)}
            />
          ))}
        </View>

        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700">받고 싶어요</Text>
          <Text className="text-xs text-gray-400">{wantedIds.length}개 선택됨</Text>
        </View>
        <Text className="text-xs text-gray-400 mb-3">이웃에게 배우고 싶은 재능을 골라주세요</Text>
        <View className="flex-row flex-wrap mb-2">
          {ALL_SKILLS.map((skill) => (
            <SkillChip
              key={skill.id}
              skill={skill}
              selected={wantedIds.includes(skill.id)}
              onToggle={() => toggle(setWantedIds, skill.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        {!canSave && (
          <Text className="text-xs text-gray-400 text-center mb-2">
            이름을 입력하고 줄 수 있어요·받고 싶어요를 각각 1개 이상 선택해주세요
          </Text>
        )}
        <Button label="저장하고 이웃 추천받기" onPress={handleSave} disabled={!canSave} />
      </View>
    </SafeAreaView>
  );
}
