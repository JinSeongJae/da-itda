import { useState } from 'react';
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
  const getReviewsForAppointment = useReviewStore((s) => s.getReviewsForAppointment);

  const [submitted, setSubmitted] = useState(false);
  const [ownWasPositive, setOwnWasPositive] = useState(false);

  const match = appointment ? getMatchById(appointment.matchId) : undefined;
  const counterpartId = match && (match.userAId === currentUserId ? match.userBId : match.userAId);
  const counterpartAlreadyReviewed =
    !!counterpartId && getReviewsForAppointment(appointmentId).some((r) => r.reviewerId === counterpartId);

  if (!appointment || !match || !counterpartId) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('review.title')} showBack />
        <Text className="text-center text-gray-500 mt-10">{t('review.notFound')}</Text>
      </SafeAreaView>
    );
  }

  const goToBadge = () => {
    const awarded = evaluateAndAwardBadge(appointmentId);
    if (awarded) router.replace(`/badge/best-friend-neighbor`);
  };

  const handleSubmit = (answers: {
    metAtSafeZone: boolean;
    exchangeWentWell: boolean;
    hadUncomfortableIncident: boolean;
  }) => {
    const review = submitReview(appointmentId, currentUserId, answers);
    setOwnWasPositive(isPositiveReview(review));
    setSubmitted(true);

    if (isEligibleForBadge(appointmentId)) {
      goToBadge();
    }
  };

  const handleSimulateCounterpart = () => {
    submitReview(appointmentId, counterpartId, {
      metAtSafeZone: true,
      exchangeWentWell: true,
      hadUncomfortableIncident: false,
    });
    if (isEligibleForBadge(appointmentId)) {
      goToBadge();
    }
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
              <>
                <Text className="text-gray-500 text-sm text-center mt-2 px-4">
                  {t('review.badgeInfo')}
                  {'\n'}
                  {counterpartAlreadyReviewed
                    ? t('review.checkingCounterpart')
                    : t('review.waitingCounterpart')}
                </Text>
                {!counterpartAlreadyReviewed && (
                  <Button
                    label={t('review.simulateButton')}
                    variant="outline"
                    className="mt-6"
                    onPress={handleSimulateCounterpart}
                  />
                )}
              </>
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
