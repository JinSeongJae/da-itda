import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommunityFeedList } from '../../components/community/CommunityFeedList';
import { MicroGroupList } from '../../components/home/MicroGroupList';
import { SEED_COMMUNITY_POSTS } from '../../mocks/communityPosts';
import { SEED_USERS } from '../../mocks/users';
import { useAuthStore } from '../../store/useAuthStore';
import { useMatchStore } from '../../store/useMatchStore';

export default function CommunityScreen() {
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const microGroups = useMatchStore((s) => s.microGroups);
  const toggleMicroGroupInterest = useMatchStore((s) => s.toggleMicroGroupInterest);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="px-6 pt-6 pb-2">
        <Text className="text-[28px] font-extrabold text-gray-900">커뮤니티</Text>
      </View>
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
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
