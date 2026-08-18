import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  return <Redirect href={isOnboarded ? '/(tabs)' : '/(onboarding)/welcome'} />;
}
