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

export default function MeetupReview() {
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
        <Header title="3초 후기" showBack />
        <Text className="text-center text-gray-500 mt-10">약속 정보를 찾을 수 없어요.</Text>
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
      <Header title="3초 안전·매너 후기" showBack />
      <View className="flex-1 px-5 pt-5">
        {!submitted ? (
          <ReviewChecklist onSubmit={handleSubmit} />
        ) : (
          <View className="items-center pt-10">
            <Feather name="check-circle" size={40} color="#10b981" />
            <Text className="text-lg font-bold text-gray-800 mt-4">후기 제출 완료!</Text>
            {ownWasPositive ? (
              <>
                <Text className="text-gray-500 text-sm text-center mt-2 px-4">
                  상대방의 후기도 함께 확인되면 "단짝 이웃" 뱃지가 발급돼요.{'\n'}
                  {counterpartAlreadyReviewed
                    ? '상대방 후기를 확인하는 중이에요...'
                    : '아직 상대방이 후기를 남기지 않았어요.'}
                </Text>
                {!counterpartAlreadyReviewed && (
                  <Button
                    label="상대방 후기 시뮬레이션 (테스트용)"
                    variant="outline"
                    className="mt-6"
                    onPress={handleSimulateCounterpart}
                  />
                )}
              </>
            ) : (
              <Text className="text-gray-500 text-sm text-center mt-2 px-4">
                소중한 의견 감사해요. 안전 관련 응답은 운영팀이 확인할 수 있어요.
              </Text>
            )}
            <Button label="채팅방으로 돌아가기" variant="ghost" className="mt-4" onPress={() => router.back()} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
