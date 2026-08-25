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
import { generateMatchRationales } from '../../utils/gemini';
import { useTranslation } from '../../utils/i18n';

export default function Home() {
  const { t, skillLabel } = useTranslation();
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
  const [rationalesById, setRationalesById] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAllUsers();
    fetchAppointments();
  }, [fetchAllUsers, fetchAppointments]);

  // 이미 매칭한(=매칭하기를 눌러 채팅이 시작된) 이웃은 추천에서 다시 뜨지 않게 제외한다.
  const alreadyMatchedIds = new Set(
    matches
      .filter((m) => m.userAId === currentUserId || m.userBId === currentUserId)
      .map((m) => (m.userAId === currentUserId ? m.userBId : m.userAId))
  );
  const candidates = Object.values(usersById).filter(
    (u) => u.id !== currentUserId && !alreadyMatchedIds.has(u.id)
  );
  const topRecommendations = currentUser ? rankCandidates(currentUser, candidates).slice(0, 3) : [];

  // 매칭 순위·점수는 그대로 알고리즘이 계산한 걸 쓰고, AI는 "왜 잘 맞는지" 한 줄 설명만 덧붙인다
  // — 순서에는 영향을 주지 않는다. 실패해도 카드 자체는 설명 없이 정상적으로 보인다.
  const topRecommendationIdsKey = topRecommendations.map((r) => r.candidate.id).join(',');
  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || !currentUser || topRecommendations.length === 0) return;

    let cancelled = false;
    generateMatchRationales({
      apiKey,
      selfOfferedLabels: currentUser.skillsOffered.map(skillLabel),
      selfWantedLabels: currentUser.skillsWanted.map(skillLabel),
      candidates: topRecommendations.map(({ candidate, compatibilityScore }) => ({
        id: candidate.id,
        name: candidate.name,
        offeredLabels: candidate.skillsOffered.map(skillLabel),
        wantedLabels: candidate.skillsWanted.map(skillLabel),
        compatibilityScore,
      })),
    })
      .then((results) => {
        if (cancelled) return;
        setRationalesById((prev) => {
          const next = { ...prev };
          for (const r of results) {
            if (r.candidateId && r.rationale) next[r.candidateId] = r.rationale;
          }
          return next;
        });
      })
      .catch(() => {
        // 장식성 설명일 뿐이라 실패해도 카드 자체는 그대로 보인다 — 조용히 무시한다.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topRecommendationIdsKey, currentUser?.id]);

  if (!currentUser) return null;

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
                  aiRationale={rationalesById[candidate.id]}
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
