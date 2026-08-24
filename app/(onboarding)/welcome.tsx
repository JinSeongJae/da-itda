import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Platform, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { LanguagePicker } from '../../components/common/LanguagePicker';
import { GYEONGSAN_CENTER } from '../../constants/theme';
import { LOCALE_LABELS } from '../../constants/i18n';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useUserStore } from '../../store/useUserStore';
import { useTranslation } from '../../utils/i18n';

WebBrowser.maybeCompleteAuthSession();

const KAKAO_AUTHORIZE_ENDPOINT = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_DISCOVERY = { authorizationEndpoint: KAKAO_AUTHORIZE_ENDPOINT };
// 카카오 콘솔이 커스텀 URL 스킴(daitda://...)을 Redirect URI로 등록해주지 않아서, 네이티브
// 앱에서는 대신 이 스킴을 WebBrowser.openAuthSessionAsync의 "복귀 감지용" URL로만 쓰고,
// 실제 카카오에 등록하는 redirect_uri는 이 스킴으로 302 리다이렉트해주는 백엔드 브릿지
// (api/auth/kakao/redirect.ts)로 둔다.
const NATIVE_RETURN_URL = 'daitda://oauth/kakao';

function extractQueryParam(url: string, key: string): string | null {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function Welcome() {
  const loginWithKakao = useAuthStore((s) => s.loginWithKakao);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const addUser = useUserStore((s) => s.addUser);
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const clientId = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID ?? '';
  // 웹은 그대로 origin 기반 리다이렉트를 쓰고, 네이티브는 위 브릿지 엔드포인트를 쓴다.
  const webRedirectUri = AuthSession.makeRedirectUri({ path: 'oauth/kakao' });
  const nativeBridgeRedirectUri = backendUrl ? `${backendUrl}/api/auth/kakao/redirect` : undefined;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri: webRedirectUri,
      responseType: AuthSession.ResponseType.Code,
      // 카카오 토큰 엔드포인트는 PKCE code_verifier를 요구하지 않는데, expo-auth-session이
      // 기본으로 PKCE(code_challenge)를 붙여 보내면 "PKCE validation failed"가 발생한다.
      usePKCE: false,
    },
    KAKAO_DISCOVERY
  );

  const exchangeCode = async (code: string, redirectUriUsed: string, codeVerifier?: string) => {
    if (!backendUrl) {
      setError(t('welcome.errorNoBackend'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      let res: Response;
      try {
        res = await fetch(`${backendUrl}/api/auth/kakao`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ code, redirectUri: redirectUriUsed, codeVerifier }),
        });
      } catch {
        throw new Error(t('welcome.errorNoConnection'));
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `${t('welcome.errorGeneric')} (${res.status})`);
      }

      const { token, user, onboarded, profile } = await res.json();
      loginWithKakao(token, user.id);

      if (onboarded && profile) {
        // 이미 관심사 설정을 마친 계정 — 서버에 저장된 프로필 그대로 복원하고 온보딩을 건너뛴다.
        addUser(profile);
        completeOnboarding(user.id);
        router.replace('/(tabs)');
        return;
      }

      addUser({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        nationality: '대한민국',
        isForeignResident: false,
        bio: '다잇다에서 새롭게 이웃을 만나고 있어요.',
        location: { city: '경산시', district: '중산동', lat: GYEONGSAN_CENTER.lat, lng: GYEONGSAN_CENTER.lng },
        languages: [{ language: LOCALE_LABELS[locale], level: '원어민' }],
        skillsOffered: [],
        skillsWanted: [],
        availability: [],
        verification: 'pending',
        badges: [],
        points: 0,
        volunteerMinutes: 0,
        createdAt: new Date().toISOString(),
      });
      router.replace('/(onboarding)/terms');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('welcome.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  // 웹: expo-auth-session이 감지한 인가 응답을 그대로 교환한다.
  useEffect(() => {
    if (!response) return;

    if (response.type === 'error') {
      setError(t('welcome.errorCancelled'));
      return;
    }
    if (response.type !== 'success') return;

    exchangeCode(response.params.code, webRedirectUri, request?.codeVerifier);
  }, [response]);

  // 네이티브: 브릿지 엔드포인트를 redirect_uri로 보내고, 커스텀 스킴 복귀를 직접 감지한다.
  const handleNativeLogin = async () => {
    if (!nativeBridgeRedirectUri) {
      setError(t('welcome.errorNoBackend'));
      return;
    }

    setError('');
    const authUrl =
      `${KAKAO_AUTHORIZE_ENDPOINT}?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(nativeBridgeRedirectUri)}`;

    // 옵션 없이 열면 안드로이드 Custom Tab이 뜨기 전에 잠깐 검은 화면이 보이는 기기가 있다 —
    // 툴바 색을 앱과 맞추고 타이틀/바 콜랩싱을 꺼서 전환이 매끄럽게 보이도록 한다.
    const result = await WebBrowser.openAuthSessionAsync(authUrl, NATIVE_RETURN_URL, {
      toolbarColor: '#ffffff',
      secondaryToolbarColor: '#ffffff',
      showTitle: false,
      enableBarCollapsing: false,
    });
    if (result.type !== 'success' || !result.url) {
      if (result.type !== 'cancel' && result.type !== 'dismiss') {
        setError(t('welcome.errorCancelled'));
      }
      return;
    }

    const code = extractQueryParam(result.url, 'code');
    if (!code) {
      setError(t('welcome.errorCancelled'));
      return;
    }
    exchangeCode(code, nativeBridgeRedirectUri);
  };

  const handlePress = () => {
    if (Platform.OS === 'web') {
      promptAsync();
    } else {
      handleNativeLogin();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-end px-6 pt-2">
        <LanguagePicker />
      </View>

      <View className="flex-1 items-center justify-between px-6 pt-6 pb-10">
        <View className="items-center mt-10">
          <Image
            source={require('../../assets/splash-icon.png')}
            style={{ width: 108, height: 108 }}
            resizeMode="contain"
          />
          <Text className="text-[30px] font-extrabold text-gray-900 mt-6">다잇다</Text>
          <Text className="text-gray-400 mt-2.5 text-center leading-6">{t('welcome.tagline')}</Text>
        </View>

        <View className="w-full">
          <Button
            label={loading ? t('welcome.kakaoLoginLoading') : t('welcome.kakaoLogin')}
            variant="kakao"
            onPress={handlePress}
            loading={loading}
            disabled={(Platform.OS === 'web' && !request) || loading}
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
