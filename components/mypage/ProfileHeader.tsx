import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';
import type { User } from '../../types';

export function ProfileHeader({ user }: { user: User }) {
  return (
    <View className="items-center pb-2">
      <View className="w-full h-20 bg-primary-500 absolute top-0 rounded-b-[32px]" />
      <View className="pt-8">
        <View className="rounded-full p-1 bg-white shadow-md shadow-gray-300">
          <Avatar uri={user.avatarUrl} size={88} />
        </View>
      </View>
      <View className="flex-row items-center mt-3">
        <Text className="text-xl font-extrabold text-gray-800">{user.name}</Text>
        {user.verification === 'verified' && (
          <Feather name="shield" size={16} color="#10b981" style={{ marginLeft: 6 }} />
        )}
      </View>
      <Text className="text-gray-500 text-xs mt-1">
        {user.nationality} · {user.location.city} {user.location.district}
      </Text>
      <Text className="text-gray-600 text-sm text-center mt-3 px-4 leading-5">{user.bio}</Text>

      <View className="flex-row flex-wrap justify-center mt-3">
        {user.languages.map((lang) => (
          <Tag key={lang.language} label={`${lang.language} · ${lang.level}`} tone="neutral" />
        ))}
      </View>

      <View className="flex-row mt-4 bg-gray-50 rounded-2xl px-5 py-3 w-full justify-around">
        <View className="items-center">
          <Text className="text-lg font-extrabold text-gray-800">{user.points}</Text>
          <Text className="text-xs text-gray-500">포인트</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-extrabold text-gray-800">{user.volunteerMinutes}</Text>
          <Text className="text-xs text-gray-500">봉사 (분)</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-extrabold text-gray-800">{user.badges.length}</Text>
          <Text className="text-xs text-gray-500">뱃지</Text>
        </View>
      </View>
    </View>
  );
}
