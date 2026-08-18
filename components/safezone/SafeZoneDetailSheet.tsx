import { forwardRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type BottomSheet from '@gorhom/bottom-sheet';
import { AppBottomSheet } from '../common/BottomSheet';
import { SafetyIndexBadge } from './SafetyIndexBadge';
import { SAFE_ZONE_TYPE_META } from '../../constants/theme';
import type { SafeZone } from '../../types';

function FactorRow({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <Text className="text-xs text-gray-500">{label}</Text>
      <View className="flex-row items-center">
        <View className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden mr-2">
          <View className="h-1.5 rounded-full bg-primary-500" style={{ width: `${value}%` }} />
        </View>
        <Text className="text-xs text-gray-600 w-8 text-right">{value}</Text>
      </View>
    </View>
  );
}

export const SafeZoneDetailSheet = forwardRef<BottomSheet, { zone: SafeZone | null }>(
  ({ zone }, ref) => {
    return (
      <AppBottomSheet ref={ref}>
        {zone && (
          <View>
            <Text className="text-lg font-extrabold text-gray-800">{zone.name}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              {SAFE_ZONE_TYPE_META[zone.type]?.label} · {zone.address}
            </Text>

            <View className="my-3">
              <SafetyIndexBadge score={zone.safetyScore} />
            </View>

            <FactorRow label="유동인구" value={zone.safetyFactors.footTraffic} />
            <FactorRow label="조명" value={zone.safetyFactors.lighting} />
            <FactorRow label="치안 (범죄율 역지표)" value={zone.safetyFactors.crimeRateInverse} />
            <FactorRow label="CCTV 커버리지" value={zone.safetyFactors.cctvCoverage} />

            <View className="flex-row items-center mt-4">
              <Feather name="clock" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600 ml-2">
                {zone.hours.days} · {zone.hours.open}~{zone.hours.close}
              </Text>
            </View>
            {zone.phone && (
              <View className="flex-row items-center mt-1.5">
                <Feather name="phone" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 ml-2">{zone.phone}</Text>
              </View>
            )}
            {zone.isPartnered && (
              <View className="flex-row items-center mt-1.5">
                <Feather name="check-circle" size={14} color="#10b981" />
                <Text className="text-xs text-primary-600 ml-2">다잇다 협약 안심존</Text>
              </View>
            )}
          </View>
        )}
      </AppBottomSheet>
    );
  }
);
SafeZoneDetailSheet.displayName = 'SafeZoneDetailSheet';
