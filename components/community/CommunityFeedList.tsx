import { Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import type { CommunityPost, CommunityPostCategory, User } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

const CATEGORY_LABEL: Record<CommunityPostCategory, string> = {
  exchange: '재능교류',
  question: '동네질문',
  group: '소모임',
};

export function CommunityFeedList({
  posts,
  usersById,
}: {
  posts: CommunityPost[];
  usersById: Record<string, User>;
}) {
  return (
    <View className="mt-9">
      <Text className="text-[13px] font-semibold text-gray-400 mb-1">동네 이야기</Text>
      <Text className="text-xl font-extrabold text-gray-900 mb-2">교류 게시판</Text>
      {posts.map((post) => {
        const author = usersById[post.authorId];
        return (
          <View key={post.id} className="py-4 border-t border-gray-100">
            <View className="flex-row items-center mb-2">
              {author && <Avatar uri={author.avatarUrl} size={26} />}
              <Text className="ml-2 text-[13px] font-semibold text-gray-700">{author?.name ?? '이웃'}</Text>
              <Text className="ml-2 text-[12px] text-gray-300">{formatRelativeTime(post.createdAt)}</Text>
              <Text className="ml-auto text-[12px] font-semibold text-primary-600">
                {CATEGORY_LABEL[post.category]}
              </Text>
            </View>
            <Text className="text-[15px] font-bold text-gray-900 mb-1">{post.title}</Text>
            <Text className="text-[13px] text-gray-500 leading-5" numberOfLines={3}>
              {post.body}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
