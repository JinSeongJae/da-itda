import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useBadgeCatchUp } from '../hooks/useBadgeCatchUp';
import { useLiveLocationTracking } from '../hooks/useLiveLocationTracking';

export default function RootLayout() {
  useLiveLocationTracking();
  useBadgeCatchUp();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chatroom/[threadId]" />
          <Stack.Screen name="appointment/[threadId]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="meetup/[appointmentId]/warning" options={{ presentation: 'modal' }} />
          <Stack.Screen name="meetup/[appointmentId]/qr" options={{ presentation: 'modal' }} />
          <Stack.Screen name="meetup/[appointmentId]/review" options={{ presentation: 'modal' }} />
          <Stack.Screen name="badge/[badgeId]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="cultural-map/index" />
          <Stack.Screen name="cultural-map/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="cultural-map/[pinId]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="admin/index" />
          <Stack.Screen name="report/[targetUserId]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="community/new-post" options={{ presentation: 'modal' }} />
          <Stack.Screen name="community/new-group" options={{ presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
