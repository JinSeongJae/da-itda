import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  // AsyncStorage reads are async even on web — without this gate, a cold load always
  // sees the pre-hydration default (isOnboarded: false) and redirects to onboarding
  // before the persisted session finishes loading.
  useEffect(() => {
    if (hydrated) return;
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  if (!hydrated) return null;

  return <Redirect href={isOnboarded ? '/(tabs)' : '/(onboarding)/welcome'} />;
}
