import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { VerificationStatus } from '../../types';
import type { TranslationKey } from '../../constants/i18n';
import { useTranslation } from '../../utils/i18n';

const STATUS_META: Record<VerificationStatus, { labelKey: TranslationKey; color: string; icon: keyof typeof Feather.glyphMap }> = {
  unverified: { labelKey: 'verification.startTitle', color: '#6b7280', icon: 'shield-off' },
  pending: { labelKey: 'verification.stepReview', color: '#b45309', icon: 'clock' },
  verified: { labelKey: 'verification.verifiedTitle', color: '#10b981', icon: 'shield' },
  rejected: { labelKey: 'verification.rejected', color: '#ef4444', icon: 'alert-circle' },
};

export function VerificationStatusCard({ status }: { status: VerificationStatus }) {
  const { t } = useTranslation();
  const meta = STATUS_META[status];
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/mypage/verification')}
      className="flex-row items-center justify-between mx-6 mb-4 p-4 rounded-3xl bg-gray-50"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${meta.color}1A` }}>
          <Feather name={meta.icon} size={18} color={meta.color} />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-400">{t('verification.cardSubtitle')}</Text>
          <Text className="text-sm font-bold" style={{ color: meta.color }}>
            {t(meta.labelKey)}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#9ca3af" />
    </Pressable>
  );
}
