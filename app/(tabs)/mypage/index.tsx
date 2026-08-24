import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BadgeGrid } from '../../../components/mypage/BadgeGrid';
import { LanguagePicker } from '../../../components/common/LanguagePicker';
import { ProfileHeader } from '../../../components/mypage/ProfileHeader';
import { SkillTagList } from '../../../components/mypage/SkillTagList';
import { VerificationStatusCard } from '../../../components/mypage/VerificationStatusCard';
import { isAdminUser } from '../../../constants/admin';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUserStore } from '../../../store/useUserStore';
import { useTranslation } from '../../../utils/i18n';

export default function MyPage() {
  const { t } = useTranslation();
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
          <Text className="text-[28px] font-extrabold text-gray-900">{t('tabs.mypage')}</Text>
          <View className="flex-row items-center gap-3">
            <LanguagePicker />
            <Pressable onPress={() => router.push('/(tabs)/mypage/edit')} hitSlop={8}>
              <Feather name="edit-2" size={20} color="#6b7280" />
            </Pressable>
          </View>
        </View>

        <ProfileHeader user={user} />

        <View className="px-6 mt-6">
          <SkillTagList title={t('mypage.offeredLabel')} skills={user.skillsOffered} tone="primary" />
          <SkillTagList title={t('mypage.wantedLabel')} skills={user.skillsWanted} tone="neutral" />
        </View>

        <VerificationStatusCard status={user.verification} />

        <Text className="text-xl font-extrabold text-gray-900 px-6 mb-3 mt-4">{t('mypage.earnedBadges')}</Text>
        <BadgeGrid earnedBadgeIds={user.badges} />

        <Pressable
          onPress={() => router.push('/(onboarding)/tutorial')}
          className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3.5 mx-6 mt-6"
        >
          <Feather name="help-circle" size={16} color="#374151" />
          <Text className="text-sm font-semibold text-gray-700 ml-2 flex-1">{t('mypage.viewTutorial')}</Text>
          <Feather name="chevron-right" size={16} color="#9ca3af" />
        </Pressable>

        <Pressable
          onPress={() => router.push('/(onboarding)/terms')}
          className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3.5 mx-6 mt-3"
        >
          <Feather name="file-text" size={16} color="#374151" />
          <Text className="text-sm font-semibold text-gray-700 ml-2 flex-1">{t('mypage.viewTerms')}</Text>
          <Feather name="chevron-right" size={16} color="#9ca3af" />
        </Pressable>

        {isAdminUser(currentUserId) && (
          <Pressable
            onPress={() => router.push('/admin')}
            className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3.5 mx-6 mt-6"
          >
            <Feather name="shield" size={16} color="#374151" />
            <Text className="text-sm font-semibold text-gray-700 ml-2 flex-1">{t('admin.entryLabel')}</Text>
            <Feather name="chevron-right" size={16} color="#9ca3af" />
          </Pressable>
        )}

        <Pressable onPress={handleLogout} className="flex-row items-center justify-center mt-8">
          <Feather name="log-out" size={15} color="#ef4444" />
          <Text className="text-sm text-red-500 ml-1.5 font-medium">{t('mypage.logout')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
