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

export default function Home() {
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const usersById = useUserStore((s) => s.usersById);
  const currentUser = usersById[currentUserId];
  const fetchAllUsers = useUserStore((s) => s.fetchAllUsers);

  const getMatchById = useMatchStore((s) => s.getMatchById);
  const createOrFetchThreadWithUser = useChatStore((s) => s.createOrFetchThreadWithUser);
  const getUpcomingAppointmentForUser = useAppointmentStore((s) => s.getUpcomingAppointmentForUser);
  const [matchingWithId, setMatchingWithId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  if (!currentUser) return null;

  const candidates = Object.values(usersById).filter((u) => u.id !== currentUserId);
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
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <LocationHeader city={currentUser.location.city} district={currentUser.location.district} />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        {upcomingAppointment && upcomingCounterpart && (
          <ConfirmedAppointmentBanner appointment={upcomingAppointment} counterpart={upcomingCounterpart} />
        )}

        <View className="mt-4">
          <Text className="text-base font-bold text-gray-800 mb-3">오늘의 AI 추천 이웃</Text>
          {topRecommendations.length === 0 ? (
            <Text className="text-sm text-gray-400 py-6 text-center">
              아직 추천할 이웃이 없어요. 곧 새로운 이웃이 가입하면 여기 채워질 거예요!
            </Text>
          ) : (
            topRecommendations.map(({ candidate, compatibilityScore }) => (
              <RecommendedNeighborCard
                key={candidate.id}
                candidate={candidate}
                compatibilityScore={compatibilityScore}
                onMatch={() => handleMatch(candidate.id)}
                matching={matchingWithId === candidate.id}
              />
            ))
          )}
        </View>

        <SuccessStoryCarousel stories={SEED_SUCCESS_STORIES} />
      </ScrollView>
    </SafeAreaView>
  );
}
