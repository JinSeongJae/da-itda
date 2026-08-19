import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

const LOCATION_UPDATE_THROTTLE_MS = 4 * 60 * 1000;
const ANDROID_CHANNEL_ID = 'smart-match';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Foreground-only GPS tracking + push-token registration for the smart urgent-match push.
 * Location updates stop as soon as the app backgrounds — no background-location permission
 * is requested, so the server's periodic scan only ever sees a "last seen while app was open" fix.
 */
export function useLiveLocationTracking() {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const lastLocationPushAt = useRef(0);
  const pushTokenRegistered = useRef(false);

  useEffect(() => {
    if (!currentUserId || !isOnboarded || Platform.OS === 'web') return;

    let subscription: Location.LocationSubscription | undefined;
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5 * 60 * 1000, distanceInterval: 150 },
        (position) => {
          const now = Date.now();
          if (now - lastLocationPushAt.current < LOCATION_UPDATE_THROTTLE_MS) return;
          lastLocationPushAt.current = now;
          updateProfile(currentUserId, {
            liveLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      );
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [currentUserId, isOnboarded, updateProfile]);

  useEffect(() => {
    if (!currentUserId || !isOnboarded || pushTokenRegistered.current) return;
    if (Platform.OS === 'web' || !Device.isDevice) return;

    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
          name: '급매칭 알림',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }

      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenResponse = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      pushTokenRegistered.current = true;
      updateProfile(currentUserId, { pushToken: tokenResponse.data });
    })();
  }, [currentUserId, isOnboarded, updateProfile]);
}
