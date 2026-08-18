import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';
import type { User } from '../../types';
import { useTranslation } from '../../utils/i18n';

export function ProfileHeader({ user }: { user: User }) {
  const { t } = useTranslation();
  return (
    <View className="items-center px-6 pt-2 pb-2">
      <Avatar uri={user.avatarUrl} size={88} />
      <View className="flex-row items-center mt-4">
        <Text className="text-2xl font-extrabold text-gray-900">{user.name}</Text>
        {user.verification === 'verified' && (
          <Feather name="shield" size={17} color="#10b981" style={{ marginLeft: 6 }} />
        )}
      </View>
      <Text className="text-gray-400 text-[13px] mt-1">
        {user.nationality} · {user.location.city} {user.location.district}
      </Text>
      <Text className="text-gray-600 text-[15px] text-center mt-4 leading-6">{user.bio}</Text>

      <View className="flex-row flex-wrap justify-center mt-4">
        {user.languages.map((lang) => (
          <Tag key={lang.language} label={`${lang.language} · ${lang.level}`} tone="neutral" />
        ))}
      </View>

      <View className="flex-row mt-6 w-full justify-around">
        <View className="items-center">
          <Text className="text-xl font-extrabold text-gray-900">{user.points}</Text>
          <Text className="text-[13px] text-gray-400 mt-0.5">{t('mypage.pointsLabel')}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-extrabold text-gray-900">{user.volunteerMinutes}</Text>
          <Text className="text-[13px] text-gray-400 mt-0.5">{t('mypage.volunteerLabel')}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-extrabold text-gray-900">{user.badges.length}</Text>
          <Text className="text-[13px] text-gray-400 mt-0.5">{t('mypage.badgesLabel')}</Text>
        </View>
      </View>
    </View>
  );
}
