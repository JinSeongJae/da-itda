import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
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
      // 카카오 토큰 엔드포인트는 PKCE code_verifier를 요구하지 않는데, expo-auth-session이
      // 기본으로 PKCE(code_challenge)를 붙여 보내면 "PKCE validation failed"가 발생한다.
      usePKCE: false,
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

    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      setError('EXPO_PUBLIC_BACKEND_URL이 설정되지 않았어요.');
      return;
    }

    const exchangeCode = async () => {
      setLoading(true);
      setError('');
      try {
        let res: Response;
        try {
          res = await fetch(`${backendUrl}/api/auth/kakao`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              code: response.params.code,
              redirectUri,
              // usePKCE: false라 보통 undefined지만, 혹시 존재하면 백엔드로 함께 전달한다.
              codeVerifier: request?.codeVerifier,
            }),
          });
        } catch {
          throw new Error('백엔드 서버에 연결할 수 없어요. 인터넷 연결과 서버 주소를 확인해주세요.');
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `로그인 처리에 실패했어요. (${res.status})`);
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
      <View className="flex-1 items-center justify-between px-6 pt-16 pb-10">
        <View className="items-center mt-10">
          <Image
            source={require('../../assets/splash-icon.png')}
            style={{ width: 108, height: 108 }}
            resizeMode="contain"
          />
          <Text className="text-[30px] font-extrabold text-gray-900 mt-6">다잇다</Text>
          <Text className="text-gray-400 mt-2.5 text-center leading-6">
            이웃과 재능을 나누는{'\n'}가장 안전한 하이퍼로컬 커뮤니티
          </Text>
        </View>

        <View className="w-full">
          <Button
            label={loading ? '로그인 처리 중...' : '카카오로 시작하기'}
            variant="kakao"
            onPress={() => promptAsync()}
            loading={loading}
            disabled={!request || loading}
          />
          {!!error && (
            <View className="flex-row items-center bg-red-50 rounded-2xl px-4 py-3 mt-4">
              <Feather name="alert-circle" size={15} color="#ef4444" />
              <Text className="text-red-500 text-xs ml-2 flex-1">{error}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
