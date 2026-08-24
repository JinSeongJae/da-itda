import { ActivityIndicator, View } from 'react-native';

/**
 * Expo Router treats the custom-scheme redirect URI (daitda://oauth/kakao) used by
 * WebBrowser.openAuthSessionAsync as a deep link and tries to navigate here on its own,
 * independently of the promise-based flow in welcome.tsx that actually reads the returned
 * code. Without a real screen at this path, that shows Expo Router's "Unmatched Route"
 * fallback right after a successful Kakao login. This screen just needs to exist — welcome.tsx's
 * own handler resolves moments later and replaces it with the real destination.
 */
export default function KakaoOAuthCallback() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#10b981" />
    </View>
  );
}
