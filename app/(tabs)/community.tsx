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
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="px-4 py-3.5 bg-white shadow-sm shadow-gray-200">
        <Text className="text-xl font-extrabold text-gray-800">커뮤니티</Text>
        <Text className="text-xs text-gray-400 mt-0.5">동네 소모임과 이웃들의 이야기를 둘러보세요</Text>
      </View>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
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
