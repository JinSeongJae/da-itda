import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
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
    <View className="mt-4">
      <View className="flex-row items-center mb-3">
        <Feather name="message-square" size={15} color="#059669" />
        <Text className="text-base font-bold text-gray-800 ml-1.5">동네 교류 게시판</Text>
      </View>
      {posts.map((post) => {
        const author = usersById[post.authorId];
        return (
          <Card key={post.id} className="mb-3">
            <View className="flex-row items-center mb-2">
              {author && <Avatar uri={author.avatarUrl} size={28} />}
              <Text className="ml-2 text-xs font-semibold text-gray-700">{author?.name ?? '이웃'}</Text>
              <Text className="ml-2 text-[11px] text-gray-400">{formatRelativeTime(post.createdAt)}</Text>
              <View className="ml-auto">
                <Tag label={CATEGORY_LABEL[post.category]} tone="neutral" />
              </View>
            </View>
            <Text className="text-sm font-bold text-gray-800 mb-1">{post.title}</Text>
            <Text className="text-xs text-gray-500" numberOfLines={3}>
              {post.body}
            </Text>
          </Card>
        );
      })}
    </View>
  );
}
