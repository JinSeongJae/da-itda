import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
