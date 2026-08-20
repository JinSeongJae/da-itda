import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReviewChecklist } from '../../../components/verification/ReviewChecklist';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import { useAppointmentStore } from '../../../store/useAppointmentStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMatchStore } from '../../../store/useMatchStore';
import { useReviewStore } from '../../../store/useReviewStore';
import { useTranslation } from '../../../utils/i18n';

const POLL_INTERVAL_MS = 4000;

export default function MeetupReview() {
  const { t } = useTranslation();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const appointment = useAppointmentStore((s) => s.appointmentsById[appointmentId]);
  const getMatchById = useMatchStore((s) => s.getMatchById);
  const submitReview = useReviewStore((s) => s.submitReview);
  const isPositiveReview = useReviewStore((s) => s.isPositiveReview);
  const isEligibleForBadge = useReviewStore((s) => s.isEligibleForBadge);
  const evaluateAndAwardBadge = useReviewStore((s) => s.evaluateAndAwardBadge);
  const fetchReviewsForAppointment = useReviewStore((s) => s.fetchReviewsForAppointment);
  // 상대방이 실제로 리뷰를 제출했는지는 서버에서 가져와야 알 수 있다 — 이 값을 구독해서
  // fetch가 갱신할 때마다 아래 effect가 다시 평가되도록 한다.
  const reviewsForAppointment = useReviewStore((s) => s.checklistsByAppointment[appointmentId]) ?? [];

  const [submitted, setSubmitted] = useState(false);
  const [ownWasPositive, setOwnWasPositive] = useState(false);
  const [badgeAwarded, setBadgeAwarded] = useState(false);

  const match = appointment ? getMatchById(appointment.matchId) : undefined;
  const counterpartId = match && (match.userAId === currentUserId ? match.userBId : match.userAId);
  const counterpartAlreadyReviewed =
    !!counterpartId && reviewsForAppointment.some((r) => r.reviewerId === counterpartId);

  // 제출 후에는 상대방의 실제 리뷰가 도착했는지 주기적으로 확인한다.
  useEffect(() => {
    if (!submitted) return;
    fetchReviewsForAppointment(appointmentId);
    const interval = setInterval(() => fetchReviewsForAppointment(appointmentId), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [submitted, appointmentId, fetchReviewsForAppointment]);

  useEffect(() => {
    if (!submitted || !ownWasPositive || badgeAwarded) return;
    if (!isEligibleForBadge(appointmentId)) return;
    const awarded = evaluateAndAwardBadge(appointmentId);
    if (awarded) {
      setBadgeAwarded(true);
      router.replace('/badge/best-friend-neighbor');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, ownWasPositive, badgeAwarded, reviewsForAppointment, appointmentId]);

  if (!appointment || !match || !counterpartId) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('review.title')} showBack />
        <Text className="text-center text-gray-500 mt-10">{t('review.notFound')}</Text>
      </SafeAreaView>
    );
  }

  const handleSubmit = (answers: {
    metAtSafeZone: boolean;
    exchangeWentWell: boolean;
    hadUncomfortableIncident: boolean;
  }) => {
    const review = submitReview(appointmentId, currentUserId, answers);
    setOwnWasPositive(isPositiveReview(review));
    setSubmitted(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('review.headerTitle')} showBack />
      <View className="flex-1 px-6 pt-5">
        {!submitted ? (
          <ReviewChecklist onSubmit={handleSubmit} />
        ) : (
          <View className="items-center pt-10">
            <Feather name="check-circle" size={40} color="#10b981" />
            <Text className="text-lg font-bold text-gray-800 mt-4">{t('review.submitted')}</Text>
            {ownWasPositive ? (
              <Text className="text-gray-500 text-sm text-center mt-2 px-4">
                {t('review.badgeInfo')}
                {'\n'}
                {counterpartAlreadyReviewed
                  ? t('review.checkingCounterpart')
                  : t('review.waitingCounterpart')}
              </Text>
            ) : (
              <Text className="text-gray-500 text-sm text-center mt-2 px-4">{t('review.negativeThanks')}</Text>
            )}
            <Button label={t('review.backToChat')} variant="ghost" className="mt-4" onPress={() => router.back()} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
