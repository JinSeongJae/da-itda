import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import { IDUploader, type PickedIdPhoto } from '../../../components/mypage/IDUploader';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUserStore } from '../../../store/useUserStore';
import { useVerificationStore } from '../../../store/useVerificationStore';
import type { VerificationDocumentType } from '../../../types';
import type { TranslationKey } from '../../../constants/i18n';
import { useTranslation } from '../../../utils/i18n';

const POLL_INTERVAL_MS = 5000;

const DOC_TYPES: { value: VerificationDocumentType; labelKey: TranslationKey }[] = [
  { value: 'id-card', labelKey: 'verification.docIdCard' },
  { value: 'foreign-registration-card', labelKey: 'verification.docForeignCard' },
];

const STEPS = [
  { key: 'submit', labelKey: 'verification.stepSubmit' },
  { key: 'review', labelKey: 'verification.stepReview' },
  { key: 'done', labelKey: 'verification.stepDone' },
] as const satisfies { key: string; labelKey: TranslationKey }[];

export default function VerificationScreen() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const user = useUserStore((s) => s.usersById[currentUserId]);
  const submitVerification = useVerificationStore((s) => s.submitVerification);
  const fetchMyVerification = useVerificationStore((s) => s.fetchMyVerification);
  const fetchAllUsers = useUserStore((s) => s.fetchAllUsers);

  const [docType, setDocType] = useState<VerificationDocumentType>('id-card');
  const [photo, setPhoto] = useState<PickedIdPhoto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 승인/반려는 관리자가 서버에서 직접 처리하므로, 내 프로필(verification/badges)도 같이
  // 새로고침해야 이 화면에 떠 있는 동안 실시간으로 단계가 넘어가는 걸 볼 수 있다.
  useEffect(() => {
    fetchMyVerification(currentUserId);
    fetchAllUsers();
    const interval = setInterval(() => {
      fetchMyVerification(currentUserId);
      fetchAllUsers();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [currentUserId, fetchMyVerification, fetchAllUsers]);

  if (!user) return null;

  const status = user.verification;
  const currentStepIndex = status === 'verified' ? 2 : status === 'pending' || status === 'rejected' ? 1 : 0;

  const handleSubmit = async () => {
    if (!photo) return;
    setSubmitting(true);
    setError('');
    const result = await submitVerification(currentUserId, docType, photo);
    setSubmitting(false);
    if (!result.ok) {
      if (result.reason === 'minor') setError(t('verification.errorMinor'));
      else if (result.reason === 'not-found') setError(result.message ?? t('verification.errorNotFound'));
      else setError(t('verification.errorGeneric'));
      return;
    }
    setPhoto(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('verification.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 text-sm mb-5">{t('verification.subtitle')}</Text>

        <View className="flex-row items-center justify-center mb-7">
          {STEPS.map((step, i) => (
            <View key={step.key} className="flex-row items-center">
              <View className="items-center">
                <View
                  className={`w-9 h-9 rounded-full items-center justify-center ${i <= currentStepIndex ? 'bg-primary-500' : 'bg-gray-200'}`}
                >
                  {i < currentStepIndex ? (
                    <Feather name="check" size={15} color="#fff" />
                  ) : (
                    <Text className={`text-xs font-bold ${i <= currentStepIndex ? 'text-white' : 'text-gray-500'}`}>{i + 1}</Text>
                  )}
                </View>
                <Text className={`text-[11px] mt-1 ${i <= currentStepIndex ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}>
                  {t(step.labelKey)}
                </Text>
              </View>
              {i < STEPS.length - 1 && (
                <View className={`w-8 h-0.5 mx-1 mb-4 ${i < currentStepIndex ? 'bg-primary-400' : 'bg-gray-200'}`} />
              )}
            </View>
          ))}
        </View>

        {status === 'verified' ? (
          <View className="items-center bg-primary-50 rounded-3xl py-10">
            <View className="w-16 h-16 rounded-full bg-primary-500 items-center justify-center mb-3">
              <Feather name="shield" size={28} color="#fff" />
            </View>
            <Text className="text-primary-700 font-bold">{t('verification.verifiedTitle')}</Text>
            <Text className="text-primary-600 text-xs mt-1">{t('verification.verifiedSubtitle')}</Text>
          </View>
        ) : (
          <>
            <Text className="text-sm font-bold text-gray-700 mb-2">{t('verification.docTypeLabel')}</Text>
            <View className="flex-row mb-4 gap-2">
              {DOC_TYPES.map((d) => (
                <Pressable
                  key={d.value}
                  onPress={() => setDocType(d.value)}
                  className={`flex-1 rounded-xl py-2.5 items-center ${docType === d.value ? 'bg-primary-500' : 'bg-gray-100'}`}
                >
                  <Text className={`text-xs font-semibold ${docType === d.value ? 'text-white' : 'text-gray-600'}`}>
                    {t(d.labelKey)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <IDUploader onPicked={setPhoto} />
            <View className="flex-row items-start mt-3 mb-1">
              <Feather name="lock" size={12} color="#9ca3af" style={{ marginTop: 2 }} />
              <Text className="text-[11px] text-gray-400 ml-1.5 flex-1 leading-4">{t('verification.maskingNotice')}</Text>
            </View>

            {status === 'pending' && (
              <View className="flex-row items-center bg-amber-50 rounded-2xl px-4 py-3 mt-3">
                <Feather name="clock" size={14} color="#b45309" />
                <Text className="text-amber-700 text-xs ml-2 flex-1">{t('verification.pending')}</Text>
              </View>
            )}
            {status === 'rejected' && (
              <View className="flex-row items-center bg-red-50 rounded-2xl px-4 py-3 mt-3">
                <Feather name="alert-circle" size={14} color="#ef4444" />
                <Text className="text-red-500 text-xs ml-2 flex-1">{t('verification.rejected')}</Text>
              </View>
            )}
            {!!error && (
              <View className="flex-row items-center bg-red-50 rounded-2xl px-4 py-3 mt-3">
                <Feather name="alert-circle" size={14} color="#ef4444" />
                <Text className="text-red-500 text-xs ml-2 flex-1">{error}</Text>
              </View>
            )}

            <Button
              label={submitting ? t('verification.submitting') : status === 'pending' ? t('verification.resubmit') : t('verification.submit')}
              className="mt-4"
              loading={submitting}
              disabled={!photo || submitting}
              onPress={handleSubmit}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
