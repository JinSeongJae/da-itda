import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { SAFE_ZONE_TYPE_META } from '../../constants/theme';
import type { SafeZone } from '../../types';

export function SafeZonePicker({
  zones,
  selectedId,
  onSelect,
}: {
  zones: SafeZone[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View>
      <Text className="text-sm font-semibold text-gray-700 mb-2">AI 추천 안심존</Text>
      {zones.map((zone, index) => {
        const meta = SAFE_ZONE_TYPE_META[zone.type];
        const selected = selectedId === zone.id;
        return (
          <Pressable
            key={zone.id}
            onPress={() => onSelect(zone.id)}
            className={`border rounded-2xl p-3.5 mb-2.5 ${selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mr-2.5">
                  <Feather name={meta?.iconName as any} size={15} color="#047857" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                    {index === 0 ? '⭐ ' : ''}
                    {zone.name}
                  </Text>
                  <Text className="text-xs text-gray-500">{meta?.label} · {zone.hours.open}~{zone.hours.close}</Text>
                </View>
              </View>
              {selected && <Feather name="check-circle" size={20} color="#10b981" />}
            </View>
            <Text className="text-xs text-primary-600 font-semibold mt-2">
              AI 안심 지수 {zone.safetyScore}점
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
