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

  const confirmMatch = useMatchStore((s) => s.confirmMatch);
  const getMatchById = useMatchStore((s) => s.getMatchById);
  const createThreadForMatch = useChatStore((s) => s.createThreadForMatch);
  const getUpcomingAppointmentForUser = useAppointmentStore((s) => s.getUpcomingAppointmentForUser);

  if (!currentUser) return null;

  const candidates = Object.values(usersById).filter((u) => u.id !== currentUserId);
  const topRecommendations = rankCandidates(currentUser, candidates).slice(0, 3);

  const upcomingAppointment = getUpcomingAppointmentForUser(currentUserId);
  const upcomingMatch = upcomingAppointment ? getMatchById(upcomingAppointment.matchId) : undefined;
  const upcomingCounterpartId =
    upcomingMatch && (upcomingMatch.userAId === currentUserId ? upcomingMatch.userBId : upcomingMatch.userAId);
  const upcomingCounterpart = upcomingCounterpartId ? usersById[upcomingCounterpartId] : undefined;

  const handleMatch = (candidateId: string) => {
    const match = confirmMatch(currentUserId, candidateId);
    const thread = createThreadForMatch(match.id);
    router.push(`/chatroom/${thread.id}`);
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
          {topRecommendations.map(({ candidate, compatibilityScore }) => (
            <RecommendedNeighborCard
              key={candidate.id}
              candidate={candidate}
              compatibilityScore={compatibilityScore}
              onMatch={() => handleMatch(candidate.id)}
            />
          ))}
        </View>

        <SuccessStoryCarousel stories={SEED_SUCCESS_STORIES} />
      </ScrollView>
    </SafeAreaView>
  );
}
