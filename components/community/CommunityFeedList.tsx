import { Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import type { CommunityPost, CommunityPostCategory, User } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';
import type { TranslationKey } from '../../constants/i18n';

const CATEGORY_KEY: Record<CommunityPostCategory, TranslationKey> = {
  exchange: 'feed.category.exchange',
  question: 'feed.category.question',
  group: 'feed.category.group',
};

export function CommunityFeedList({
  posts,
  usersById,
}: {
  posts: CommunityPost[];
  usersById: Record<string, User>;
}) {
  const { t } = useTranslation();
  return (
    <View className="mt-9">
      <Text className="text-[13px] font-semibold text-gray-400 mb-1">{t('feed.label')}</Text>
      <Text className="text-xl font-extrabold text-gray-900 mb-2">{t('feed.title')}</Text>
      {posts.map((post) => {
        const author = usersById[post.authorId];
        return (
          <View key={post.id} className="py-4 border-t border-gray-100">
            <View className="flex-row items-center mb-2">
              {author && <Avatar uri={author.avatarUrl} size={26} />}
              <Text className="ml-2 text-[13px] font-semibold text-gray-700">
                {author?.name ?? t('feed.neighborFallback')}
              </Text>
              <Text className="ml-2 text-[12px] text-gray-300">{formatRelativeTime(post.createdAt)}</Text>
              <Text className="ml-auto text-[12px] font-semibold text-primary-600">
                {t(CATEGORY_KEY[post.category])}
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
