import { useEffect, useMemo } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommunityFeedList } from '../../components/community/CommunityFeedList';
import { MicroGroupList } from '../../components/home/MicroGroupList';
import { useAuthStore } from '../../store/useAuthStore';
import { useCommunityPostStore } from '../../store/useCommunityPostStore';
import { useMatchStore } from '../../store/useMatchStore';
import { useUserStore } from '../../store/useUserStore';
import { useTranslation } from '../../utils/i18n';

export default function CommunityScreen() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const usersById = useUserStore((s) => s.usersById);
  const microGroups = useMatchStore((s) => s.microGroups);
  const toggleMicroGroupInterest = useMatchStore((s) => s.toggleMicroGroupInterest);
  const fetchMicroGroups = useMatchStore((s) => s.fetchMicroGroups);
  const deleteMicroGroup = useMatchStore((s) => s.deleteMicroGroup);
  const postsById = useCommunityPostStore((s) => s.postsById);
  const fetchPosts = useCommunityPostStore((s) => s.fetchPosts);
  const deletePost = useCommunityPostStore((s) => s.deletePost);
  // getAllPosts() sorts into a brand-new array every call — selecting it directly would hand
  // React 18's useSyncExternalStore a different reference on every render and infinite-loop.
  const posts = useMemo(
    () => Object.values(postsById).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [postsById]
  );

  useEffect(() => {
    fetchMicroGroups();
    fetchPosts();
  }, [fetchMicroGroups, fetchPosts]);

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
          onDelete={(groupId) => deleteMicroGroup(groupId)}
          headerAction={
            <Pressable
              onPress={() => router.push('/community/new-group')}
              className="flex-row items-center bg-gray-50 rounded-full px-3 py-1.5"
            >
              <Feather name="plus" size={13} color="#374151" />
              <Text className="text-xs font-semibold text-gray-700 ml-1">{t('community.newGroupButton')}</Text>
            </Pressable>
          }
        />

        <CommunityFeedList
          posts={posts}
          usersById={usersById}
          currentUserId={currentUserId}
          onDelete={(postId) => deletePost(postId)}
          headerAction={
            <Pressable
              onPress={() => router.push('/community/new-post')}
              className="flex-row items-center bg-gray-50 rounded-full px-3 py-1.5"
            >
              <Feather name="edit-3" size={13} color="#374151" />
              <Text className="text-xs font-semibold text-gray-700 ml-1">{t('community.writeButton')}</Text>
            </Pressable>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
