import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { VerificationStatus } from '../../types';

const STATUS_META: Record<VerificationStatus, { label: string; color: string; icon: keyof typeof Feather.glyphMap }> = {
  unverified: { label: '안심인증 시작하기', color: '#6b7280', icon: 'shield-off' },
  pending: { label: '검토 대기 중', color: '#b45309', icon: 'clock' },
  verified: { label: '인증 완료 (안심인증 뱃지 부여)', color: '#10b981', icon: 'shield' },
  rejected: { label: '반려됨 · 다시 제출해주세요', color: '#ef4444', icon: 'alert-circle' },
};

export function VerificationStatusCard({ status }: { status: VerificationStatus }) {
  const meta = STATUS_META[status];
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/mypage/verification')}
      className="flex-row items-center justify-between mx-4 mb-4 p-4 rounded-3xl border border-gray-100/80 bg-white shadow-md shadow-gray-200"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${meta.color}1A` }}>
          <Feather name={meta.icon} size={18} color={meta.color} />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-400">신분증·외국인등록증 수동 안심인증</Text>
          <Text className="text-sm font-bold" style={{ color: meta.color }}>
            {meta.label}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#9ca3af" />
    </Pressable>
  );
}
