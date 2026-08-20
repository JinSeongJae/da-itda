import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { GYEONGSAN_DISTRICTS, isWithinGyeongsan } from '../../constants/location';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import { useTranslation } from '../../utils/i18n';

type CheckStatus = 'checking' | 'inside' | 'outside' | 'error';

export default function LocationSetup() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [status, setStatus] = useState<CheckStatus>('checking');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [district, setDistrict] = useState<string | null>(null);

  const checkLocation = async () => {
    setStatus('checking');
    try {
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setStatus('error');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoords({ lat, lng });
      setStatus(isWithinGyeongsan(lat, lng) ? 'inside' : 'outside');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    checkLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    if (!coords || !district) return;
    updateProfile(currentUserId, {
      location: { city: '경산시', district, lat: coords.lat, lng: coords.lng },
    });
    completeOnboarding(currentUserId);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('locationSetup.title')} />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 mb-6 leading-5">{t('locationSetup.subtitle')}</Text>

        {status === 'checking' && (
          <View className="items-center py-10">
            <Text className="text-sm text-gray-400">{t('locationSetup.checkingLocation')}</Text>
          </View>
        )}

        {status === 'error' && (
          <View className="bg-red-50 rounded-2xl p-4 mb-4">
            <Text className="text-sm text-red-500">{t('culturalMap.locationPermissionDenied')}</Text>
          </View>
        )}

        {status === 'outside' && (
          <View className="bg-red-50 rounded-2xl p-5 mb-4">
            <Text className="text-sm font-bold text-red-600 mb-1">{t('locationSetup.outsideBoundsTitle')}</Text>
            <Text className="text-xs text-red-500 leading-5">{t('locationSetup.outsideBoundsBody')}</Text>
          </View>
        )}

        {(status === 'error' || status === 'outside') && (
          <Button label={t('locationSetup.retryButton')} variant="outline" onPress={checkLocation} />
        )}

        {status === 'inside' && (
          <>
            <View className="flex-row items-center bg-primary-50 rounded-2xl px-4 py-3 mb-5">
              <Feather name="check-circle" size={15} color="#059669" />
              <Text className="text-xs text-primary-700 font-medium ml-2">{t('locationSetup.insideConfirmed')}</Text>
            </View>

            <Text className="text-sm font-semibold text-gray-700 mb-2">{t('locationSetup.pickDistrictLabel')}</Text>
            <View className="flex-row flex-wrap mb-6">
              {GYEONGSAN_DISTRICTS.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDistrict(d)}
                  className={`rounded-full px-3.5 py-2 mr-2 mb-2 border ${
                    district === d ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className={`text-xs font-semibold ${district === d ? 'text-white' : 'text-gray-700'}`}>
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {status === 'inside' && (
        <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
          <Button label={t('locationSetup.confirmButton')} onPress={handleConfirm} disabled={!district} />
        </View>
      )}
    </SafeAreaView>
  );
}
