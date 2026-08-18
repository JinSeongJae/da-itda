import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
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
    <SafeAreaView className="flex-1 bg-white justify-between px-5 pb-8 pt-10">
      <Svg width="100%" height="55%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          <RadialGradient id="badgeGlow" cx="50%" cy="20%" r="70%">
            <Stop offset="0" stopColor="#6ee7b7" stopOpacity={0.4} />
            <Stop offset="1" stopColor="#6ee7b7" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#badgeGlow)" />
      </Svg>
      <BadgeUnlockBanner badge={badge} />
      <Button label="확인" onPress={() => router.replace('/(tabs)/chat')} />
    </SafeAreaView>
  );
}
