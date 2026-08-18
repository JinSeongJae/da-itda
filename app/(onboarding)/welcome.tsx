import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { GYEONGSAN_CENTER } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';

WebBrowser.maybeCompleteAuthSession();

const KAKAO_DISCOVERY = {
  authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
};

export default function Welcome() {
  const loginWithKakao = useAuthStore((s) => s.loginWithKakao);
  const addUser = useUserStore((s) => s.addUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'daitda', path: 'oauth/kakao' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID ?? '',
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    KAKAO_DISCOVERY
  );

  useEffect(() => {
    if (!response) return;

    if (response.type === 'error') {
      setError('카카오 로그인이 취소되었거나 실패했어요.');
      return;
    }
    if (response.type !== 'success') return;

    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      setError('EXPO_PUBLIC_API_BASE_URL이 설정되지 않았어요.');
      return;
    }

    const exchangeCode = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${apiBaseUrl}/api/auth/kakao`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ code: response.params.code, redirectUri }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? '로그인 처리에 실패했어요.');
        }

        const { token, user } = await res.json();
        loginWithKakao(token, user.id);
        addUser({
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          nationality: '대한민국',
          isForeignResident: false,
          bio: '다잇다에서 새롭게 이웃을 만나고 있어요.',
          location: { city: '경산시', district: '중산동', lat: GYEONGSAN_CENTER.lat, lng: GYEONGSAN_CENTER.lng },
          languages: [{ language: '한국어', level: '원어민' }],
          skillsOffered: [],
          skillsWanted: [],
          availability: [],
          verification: 'pending',
          badges: [],
          points: 0,
          volunteerMinutes: 0,
          createdAt: new Date().toISOString(),
        });
        router.replace('/(onboarding)/interest-selection');
      } catch (err) {
        setError(err instanceof Error ? err.message : '로그인 처리에 실패했어요.');
      } finally {
        setLoading(false);
      }
    };

    exchangeCode();
  }, [response]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-20 h-20 rounded-3xl bg-primary-500 items-center justify-center mb-5">
          <Text className="text-white text-3xl font-extrabold">다</Text>
        </View>
        <Text className="text-2xl font-extrabold text-gray-800">다잇다</Text>
        <Text className="text-gray-500 mt-2 text-center mb-10">
          이웃과 재능을 나누는{'\n'}가장 안전한 하이퍼로컬 커뮤니티
        </Text>
        <Button
          label={loading ? '로그인 처리 중...' : '카카오로 시작하기'}
          onPress={() => promptAsync()}
          loading={loading}
          disabled={!request || loading}
        />
        {!!error && <Text className="text-red-500 text-sm mt-4 text-center">{error}</Text>}
      </View>
    </SafeAreaView>
  );
}
