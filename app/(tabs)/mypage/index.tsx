import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BadgeGrid } from '../../../components/mypage/BadgeGrid';
import { ProfileHeader } from '../../../components/mypage/ProfileHeader';
import { SkillTagList } from '../../../components/mypage/SkillTagList';
import { VerificationStatusCard } from '../../../components/mypage/VerificationStatusCard';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUserStore } from '../../../store/useUserStore';

export default function MyPage() {
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const user = useUserStore((s) => s.usersById[currentUserId]);

  if (!user) return null;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="flex-row justify-end px-4 pt-2">
          <Pressable onPress={() => router.push('/(tabs)/mypage/edit')} className="flex-row items-center">
            <Feather name="edit-2" size={14} color="#6b7280" />
            <Text className="text-xs text-gray-500 ml-1">프로필 수정</Text>
          </Pressable>
        </View>

        <ProfileHeader user={user} />

        <View className="px-4 mt-4">
          <SkillTagList title="줄 수 있어요" skills={user.skillsOffered} tone="primary" />
          <SkillTagList title="받고 싶어요" skills={user.skillsWanted} tone="neutral" />
        </View>

        <VerificationStatusCard status={user.verification} />

        <Text className="text-sm font-bold text-gray-700 px-4 mb-2 mt-2">획득한 뱃지</Text>
        <BadgeGrid earnedBadgeIds={user.badges} />
      </ScrollView>
    </SafeAreaView>
  );
}
