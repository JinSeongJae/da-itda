import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BadgeUnlockBanner } from '../../components/verification/BadgeUnlockBanner';
import { Button } from '../../components/common/Button';
import { BADGES } from '../../mocks/badges';

export default function BadgeEarned() {
  const { badgeId } = useLocalSearchParams<{ badgeId: string }>();
  const badge = BADGES[badgeId];

  if (!badge) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">뱃지 정보를 찾을 수 없어요.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-between px-6 pb-8 pt-10">
      <BadgeUnlockBanner badge={badge} />
      <Button label="확인" onPress={() => router.replace('/(tabs)/chat')} />
    </SafeAreaView>
  );
}
