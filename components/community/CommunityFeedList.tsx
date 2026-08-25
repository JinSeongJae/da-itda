import type { ReactNode } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  currentUserId,
  onDelete,
  headerAction,
}: {
  posts: CommunityPost[];
  usersById: Record<string, User>;
  currentUserId?: string;
  onDelete?: (postId: string) => void;
  headerAction?: ReactNode;
}) {
  const { t } = useTranslation();

  const confirmDelete = (postId: string) => {
    Alert.alert(t('common.deleteConfirmTitle'), t('common.deleteConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => onDelete?.(postId) },
    ]);
  };

  return (
    <View className="mt-9">
      <Text className="text-[13px] font-semibold text-gray-400 mb-1">{t('feed.label')}</Text>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xl font-extrabold text-gray-900">{t('feed.title')}</Text>
        {headerAction}
      </View>
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
              {currentUserId === post.authorId && (
                <Pressable onPress={() => confirmDelete(post.id)} hitSlop={8} className="ml-2">
                  <Feather name="trash-2" size={13} color="#9ca3af" />
                </Pressable>
              )}
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
