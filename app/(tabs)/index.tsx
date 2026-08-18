import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
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
  const fetchAppointments = useAppointmentStore((s) => s.fetchAppointments);
  const [matchingWithId, setMatchingWithId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers();
    fetchAppointments();
  }, [fetchAllUsers, fetchAppointments]);

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

        <Text className="text-xl font-extrabold text-gray-800 mt-5">
          안녕하세요, {currentUser.name}님
        </Text>
        <Text className="text-sm text-gray-400 mt-1 mb-1">오늘도 새로운 이웃과 재능을 나눠보세요</Text>

        <View className="mt-4">
          <View className="flex-row items-center mb-3">
            <Feather name="star" size={15} color="#059669" />
            <Text className="text-base font-bold text-gray-800 ml-1.5">오늘의 AI 추천 이웃</Text>
          </View>
          {topRecommendations.length === 0 ? (
            <View className="bg-white rounded-3xl border border-gray-100 py-8 items-center">
              <Feather name="users" size={22} color="#d1d5db" />
              <Text className="text-sm text-gray-400 mt-2 text-center px-6">
                아직 추천할 이웃이 없어요.{'\n'}곧 새로운 이웃이 가입하면 여기 채워질 거예요!
              </Text>
            </View>
          ) : (
            topRecommendations.map(({ candidate, compatibilityScore }, index) => (
              <RecommendedNeighborCard
                key={candidate.id}
                candidate={candidate}
                compatibilityScore={compatibilityScore}
                onMatch={() => handleMatch(candidate.id)}
                matching={matchingWithId === candidate.id}
                topPick={index === 0}
              />
            ))
          )}
        </View>

        <SuccessStoryCarousel stories={SEED_SUCCESS_STORIES} />
      </ScrollView>
    </SafeAreaView>
  );
}
