import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { scoreColor } from '../../constants/theme';

export function SafetyIndexBadge({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <View
      className="flex-row items-center self-start rounded-full px-3 py-1.5"
      style={{ backgroundColor: `${color}1A` }}
    >
      <Feather name="shield" size={13} color={color} />
      <Text className="text-xs font-bold ml-1.5" style={{ color }}>
        AI 안심 지수 {score}점
      </Text>
    </View>
  );
}
