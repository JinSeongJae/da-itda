import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { SAFE_ZONE_TYPE_META } from '../../constants/theme';
import type { SafeZone } from '../../types';
import { useTranslation } from '../../utils/i18n';

export function SafeZonePicker({
  zones,
  selectedId,
  onSelect,
}: {
  zones: SafeZone[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <View>
      <Text className="text-sm font-semibold text-gray-700 mb-2">{t('safeZone.aiLabel')}</Text>
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
                  <View className="flex-row items-center">
                    <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                      {zone.name}
                    </Text>
                    {index === 0 && (
                      <View className="flex-row items-center bg-primary-50 rounded-full px-1.5 py-0.5 ml-1.5">
                        <Feather name="award" size={9} color="#059669" />
                        <Text className="text-[9px] font-bold text-primary-700 ml-0.5">{t('safeZone.recommended')}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-gray-500">{meta?.label} · {zone.hours.open}~{zone.hours.close}</Text>
                </View>
              </View>
              {selected && <Feather name="check-circle" size={20} color="#10b981" />}
            </View>
            <Text className="text-xs text-primary-600 font-semibold mt-2">
              {t('safeZone.scoreLabel', { score: zone.safetyScore })}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
