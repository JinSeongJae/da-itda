import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import type { TranslationKey } from '../../constants/i18n';
import { useVerificationStore } from '../../store/useVerificationStore';
import type { ReportReason } from '../../types';
import { useTranslation } from '../../utils/i18n';

const REASON_OPTIONS: { value: ReportReason; key: TranslationKey }[] = [
  { value: 'inappropriate', key: 'report.reason.inappropriate' },
  { value: 'no-show', key: 'report.reason.no-show' },
  { value: 'harassment', key: 'report.reason.harassment' },
  { value: 'scam', key: 'report.reason.scam' },
  { value: 'other', key: 'report.reason.other' },
];

export default function ReportScreen() {
  const { t } = useTranslation();
  const { targetUserId, threadId } = useLocalSearchParams<{ targetUserId: string; threadId?: string }>();
  const submitReport = useVerificationStore((s) => s.submitReport);

  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    const ok = await submitReport(targetUserId, reason, detail.trim() || undefined, threadId);
    setSubmitting(false);
    if (ok) {
      Alert.alert(t('report.successTitle'), t('report.successBody'), [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert(t('report.errorMessage'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('report.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 mb-6 leading-5">{t('report.subtitle')}</Text>

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('report.reasonLabel')}</Text>
        <View className="flex-row flex-wrap mb-5">
          {REASON_OPTIONS.map((opt) => (
            <View key={opt.value} className="mr-2 mb-2">
              <Button
                label={t(opt.key)}
                variant={reason === opt.value ? 'primary' : 'outline'}
                fullWidth={false}
                onPress={() => setReason(opt.value)}
                className="px-4 py-2.5"
              />
            </View>
          ))}
        </View>

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('report.detailLabel')}</Text>
        <TextInput
          value={detail}
          onChangeText={setDetail}
          multiline
          numberOfLines={4}
          placeholder={t('report.detailPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-2"
          textAlignVertical="top"
        />
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        {!reason && <Text className="text-xs text-gray-400 text-center mb-2">{t('report.validationHint')}</Text>}
        <Button
          label={submitting ? t('report.submitting') : t('report.submitButton')}
          variant="danger"
          disabled={!reason || submitting}
          loading={submitting}
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
