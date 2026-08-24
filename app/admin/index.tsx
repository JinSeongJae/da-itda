import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/common/EmptyState';
import { Header } from '../../components/common/Header';
import { isAdminUser } from '../../constants/admin';
import type { TranslationKey } from '../../constants/i18n';
import { useAuthStore } from '../../store/useAuthStore';
import { useVerificationStore } from '../../store/useVerificationStore';
import { useTranslation } from '../../utils/i18n';
import { formatRelativeTime } from '../../utils/formatters';

export default function AdminScreen() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const pendingForAdmin = useVerificationStore((s) => s.pendingForAdmin);
  const openReports = useVerificationStore((s) => s.openReports);
  const fetchPendingVerifications = useVerificationStore((s) => s.fetchPendingVerifications);
  const fetchOpenReports = useVerificationStore((s) => s.fetchOpenReports);
  const approveVerification = useVerificationStore((s) => s.approveVerification);
  const rejectVerification = useVerificationStore((s) => s.rejectVerification);
  const resolveReport = useVerificationStore((s) => s.resolveReport);
  const dismissReport = useVerificationStore((s) => s.dismissReport);

  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingVerifications();
    fetchOpenReports();
  }, [fetchPendingVerifications, fetchOpenReports]);

  if (!isAdminUser(currentUserId)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('admin.title')} showBack />
        <EmptyState iconName="lock" title={t('admin.noAccess')} />
      </SafeAreaView>
    );
  }

  const withBusy = async (id: string, action: () => Promise<boolean>) => {
    setBusyId(id);
    await action();
    setBusyId(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('admin.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="text-xl font-extrabold text-gray-900 mb-1">{t('admin.verificationSectionTitle')}</Text>
        <Text className="text-xs text-gray-400 mb-4">{t('admin.verificationSectionSubtitle')}</Text>

        {pendingForAdmin.length === 0 ? (
          <View className="mb-8">
            <EmptyState iconName="shield" title={t('admin.noVerifications')} />
          </View>
        ) : (
          pendingForAdmin.map((req) => (
            <View key={req.id} className="border border-gray-100 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Text className="text-sm font-bold text-gray-800 flex-1">
                  {req.applicantName ?? t('feed.neighborFallback')}
                </Text>
                <Text className="text-[11px] text-gray-400">{formatRelativeTime(req.submittedAt)}</Text>
              </View>
              <Image
                source={{ uri: req.maskedImageUrl }}
                style={{ width: '100%', height: 180, borderRadius: 12, backgroundColor: '#f3f4f6' }}
                resizeMode="contain"
              />
              <View className="flex-row items-center mt-2.5">
                <Text className="text-xs text-gray-500">
                  {req.documentType === 'id-card' ? t('verification.docIdCard') : t('verification.docForeignCard')}
                </Text>
                {!!req.birthDate && (
                  <Text className="text-xs text-gray-500 ml-3">{t('admin.birthDateLabel', { date: req.birthDate })}</Text>
                )}
              </View>
              <View className="flex-row mt-3.5">
                <Pressable
                  disabled={busyId === req.id}
                  onPress={() => withBusy(req.id, () => rejectVerification(req.id))}
                  className="flex-1 bg-white border border-gray-200 rounded-full py-2.5 items-center mr-2"
                >
                  <Text className="text-gray-600 text-sm font-bold">{t('verification.reject')}</Text>
                </Pressable>
                <Pressable
                  disabled={busyId === req.id}
                  onPress={() => withBusy(req.id, () => approveVerification(req.id))}
                  className="flex-1 bg-primary-500 rounded-full py-2.5 items-center"
                >
                  <Text className="text-white text-sm font-bold">{t('verification.approve')}</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        <Text className="text-xl font-extrabold text-gray-900 mb-1 mt-2">{t('admin.reportSectionTitle')}</Text>
        <Text className="text-xs text-gray-400 mb-4">{t('admin.reportSectionSubtitle')}</Text>

        {openReports.length === 0 ? (
          <EmptyState iconName="flag" title={t('admin.noReports')} />
        ) : (
          openReports.map((report) => (
            <View key={report.id} className="border border-gray-100 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-sm font-bold text-gray-800">
                  {report.reporterName ?? t('feed.neighborFallback')} → {report.targetName ?? t('feed.neighborFallback')}
                </Text>
                <Text className="text-[11px] text-gray-400">{formatRelativeTime(report.createdAt)}</Text>
              </View>
              <Text className="text-xs font-semibold text-red-500 mb-1">
                {t(`report.reason.${report.reason}` as TranslationKey)}
              </Text>
              {!!report.detail && <Text className="text-xs text-gray-600 mb-2">{report.detail}</Text>}
              {!!report.threadId && (
                <Pressable onPress={() => router.push(`/chatroom/${report.threadId}`)} className="mb-2">
                  <Text className="text-xs text-primary-600 font-semibold">{t('admin.viewThread')}</Text>
                </Pressable>
              )}
              <View className="flex-row mt-1.5">
                <Pressable
                  disabled={busyId === report.id}
                  onPress={() => withBusy(report.id, () => dismissReport(report.id))}
                  className="flex-1 bg-white border border-gray-200 rounded-full py-2.5 items-center mr-2"
                >
                  <Text className="text-gray-600 text-sm font-bold">{t('admin.dismissReport')}</Text>
                </Pressable>
                <Pressable
                  disabled={busyId === report.id}
                  onPress={() => withBusy(report.id, () => resolveReport(report.id))}
                  className="flex-1 bg-gray-900 rounded-full py-2.5 items-center"
                >
                  <Text className="text-white text-sm font-bold">{t('admin.resolveReport')}</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
