import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmedAppointmentBanner } from '../../components/home/ConfirmedAppointmentBanner';
import { LocationHeader } from '../../components/home/LocationHeader';
import { RecommendedNeighborCard } from '../../components/home/RecommendedNeighborCard';
import { SuccessStoryCarousel } from '../../components/home/SuccessStoryCarousel';
import { SEED_SUCCESS_STORIES } from '../../mocks/successStories';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useMatchStore } from '../../store/useMatchStore';
import { useUserStore } from '../../store/useUserStore';
import { rankCandidates } from '../../utils/matchAlgorithm';
import { useTranslation } from '../../utils/i18n';

export default function Home() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const usersById = useUserStore((s) => s.usersById);
  const currentUser = usersById[currentUserId];
  const fetchAllUsers = useUserStore((s) => s.fetchAllUsers);

  const matches = useMatchStore((s) => s.matches);
  const getMatchById = useMatchStore((s) => s.getMatchById);
  const createOrFetchThreadWithUser = useChatStore((s) => s.createOrFetchThreadWithUser);
  const getUpcomingAppointmentForUser = useAppointmentStore((s) => s.getUpcomingAppointmentForUser);
  const fetchAppointments = useAppointmentStore((s) => s.fetchAppointments);
  const [matchingWithId, setMatchingWithId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers();
    fetchAppointments();
  }, [fetchAllUsers, fetchAppointments]);

  if (!currentUser) return null;

  // 이미 매칭한(=매칭하기를 눌러 채팅이 시작된) 이웃은 추천에서 다시 뜨지 않게 제외한다.
  const alreadyMatchedIds = new Set(
    matches
      .filter((m) => m.userAId === currentUserId || m.userBId === currentUserId)
      .map((m) => (m.userAId === currentUserId ? m.userBId : m.userAId))
  );
  const candidates = Object.values(usersById).filter(
    (u) => u.id !== currentUserId && !alreadyMatchedIds.has(u.id)
  );
  const topRecommendations = rankCandidates(currentUser, candidates).slice(0, 3);

  const upcomingAppointment = getUpcomingAppointmentForUser(currentUserId);
  const upcomingMatch = upcomingAppointment ? getMatchById(upcomingAppointment.matchId) : undefined;
  const upcomingCounterpartId =
    upcomingMatch && (upcomingMatch.userAId === currentUserId ? upcomingMatch.userBId : upcomingMatch.userAId);
  const upcomingCounterpart = upcomingCounterpartId ? usersById[upcomingCounterpartId] : undefined;

  const handleMatch = async (candidateId: string) => {
    setMatchingWithId(candidateId);
    try {
      const thread = await createOrFetchThreadWithUser(candidateId);
      router.push(`/chatroom/${thread.id}`);
    } finally {
      setMatchingWithId(null);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <LocationHeader city={currentUser.location.city} district={currentUser.location.district} />
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-[28px] leading-9 font-extrabold text-gray-900 mt-6">
          {t('home.greeting', { name: currentUser.name })}
        </Text>

        {upcomingAppointment && upcomingCounterpart ? (
          <ConfirmedAppointmentBanner appointment={upcomingAppointment} counterpart={upcomingCounterpart} />
        ) : (
          <View className="bg-gray-50 px-6 py-5 rounded-3xl mt-3">
            <Text className="text-gray-500 text-[14px] font-semibold text-center">
              {t('home.noAppointmentPlaceholder')}
            </Text>
          </View>
        )}

        <View className="mt-10">
          <Text className="text-[13px] font-semibold text-gray-400 mb-1">{t('home.recommendedLabel')}</Text>
          <Text className="text-xl font-extrabold text-gray-900 mb-1">{t('home.recommendedTitle')}</Text>
          {topRecommendations.length === 0 ? (
            <View className="py-10 items-center">
              <Text className="text-sm text-gray-400 text-center leading-5">{t('home.noRecommendations')}</Text>
            </View>
          ) : (
            <View className="mt-3">
              {topRecommendations.map(({ candidate, compatibilityScore }, index) => (
                <RecommendedNeighborCard
                  key={candidate.id}
                  candidate={candidate}
                  compatibilityScore={compatibilityScore}
                  onMatch={() => handleMatch(candidate.id)}
                  matching={matchingWithId === candidate.id}
                  topPick={index === 0}
                />
              ))}
            </View>
          )}
        </View>

        <SuccessStoryCarousel stories={SEED_SUCCESS_STORIES} />
      </ScrollView>
    </SafeAreaView>
  );
}
