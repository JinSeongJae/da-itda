import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommunityFeedList } from '../../components/community/CommunityFeedList';
import { MicroGroupList } from '../../components/home/MicroGroupList';
import { SEED_COMMUNITY_POSTS } from '../../mocks/communityPosts';
import { SEED_USERS } from '../../mocks/users';
import { useAuthStore } from '../../store/useAuthStore';
import { useMatchStore } from '../../store/useMatchStore';
import { useTranslation } from '../../utils/i18n';

export default function CommunityScreen() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const microGroups = useMatchStore((s) => s.microGroups);
  const toggleMicroGroupInterest = useMatchStore((s) => s.toggleMicroGroupInterest);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="px-6 pt-6 pb-2">
        <Text className="text-[28px] font-extrabold text-gray-900">{t('tabs.community')}</Text>
      </View>
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable
          onPress={() => router.push('/cultural-map')}
          className="flex-row items-center bg-primary-50 rounded-2xl p-4 mb-5"
        >
          <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center mr-3">
            <Feather name="map" size={17} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-900">{t('culturalMap.entryCardTitle')}</Text>
            <Text className="text-xs text-gray-500 mt-0.5">{t('culturalMap.entryCardSubtitle')}</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#9ca3af" />
        </Pressable>

        <MicroGroupList
          groups={microGroups}
          currentUserId={currentUserId}
          onToggleInterest={(groupId) => toggleMicroGroupInterest(groupId, currentUserId)}
        />
        <CommunityFeedList posts={SEED_COMMUNITY_POSTS} usersById={SEED_USERS} />
      </ScrollView>
    </SafeAreaView>
  );
}
