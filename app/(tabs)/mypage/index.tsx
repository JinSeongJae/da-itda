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
  const logout = useAuthStore((s) => s.logout);
  const user = useUserStore((s) => s.usersById[currentUserId]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace('/(onboarding)/welcome');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="flex-row justify-between items-center px-6 pt-6">
          <Text className="text-[28px] font-extrabold text-gray-900">마이페이지</Text>
          <Pressable onPress={() => router.push('/(tabs)/mypage/edit')} hitSlop={8}>
            <Feather name="edit-2" size={20} color="#6b7280" />
          </Pressable>
        </View>

        <ProfileHeader user={user} />

        <View className="px-6 mt-6">
          <SkillTagList title="줄 수 있어요" skills={user.skillsOffered} tone="primary" />
          <SkillTagList title="받고 싶어요" skills={user.skillsWanted} tone="neutral" />
        </View>

        <VerificationStatusCard status={user.verification} />

        <Text className="text-xl font-extrabold text-gray-900 px-6 mb-3 mt-4">획득한 뱃지</Text>
        <BadgeGrid earnedBadgeIds={user.badges} />

        <Pressable onPress={handleLogout} className="flex-row items-center justify-center mt-8">
          <Feather name="log-out" size={15} color="#ef4444" />
          <Text className="text-sm text-red-500 ml-1.5 font-medium">로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
