import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Alert, ScrollView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { CULTURAL_PIN_CATEGORY_META } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useCulturalMapStore } from '../../store/useCulturalMapStore';
import { useUserStore } from '../../store/useUserStore';
import { useTranslation } from '../../utils/i18n';
import type { TranslationKey } from '../../constants/i18n';

export default function CulturalPinDetail() {
  const { t } = useTranslation();
  const { pinId } = useLocalSearchParams<{ pinId: string }>();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const pin = useCulturalMapStore((s) => s.pinsById[pinId]);
  const verifyPin = useCulturalMapStore((s) => s.verifyPin);
  const deletePin = useCulturalMapStore((s) => s.deletePin);
  const author = useUserStore((s) => (pin ? s.usersById[pin.authorId] : undefined));

  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);

  if (!pin) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title={t('culturalMap.pinNotFoundTitle')} showBack />
      </SafeAreaView>
    );
  }

  const meta = CULTURAL_PIN_CATEGORY_META[pin.category];
  const isAuthor = pin.authorId === currentUserId;
  const alreadyVerified = pin.verifications.some((v) => v.userId === currentUserId);

  const handleVerify = async () => {
    setVerifying(true);
    setMessage('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMessageIsError(true);
        setMessage(t('culturalMap.locationPermissionDenied'));
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const result = await verifyPin(pin.id, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      if (result.ok) {
        setMessageIsError(false);
        setMessage(t('culturalMap.verifySuccess', { name: author?.name ?? t('feed.neighborFallback') }));
      } else {
        setMessageIsError(true);
        const reasonKey: Record<string, TranslationKey> = {
          self: 'culturalMap.verifyErrorSelf',
          duplicate: 'culturalMap.verifyErrorDuplicate',
          'too-far': 'culturalMap.verifyErrorTooFar',
          'not-found': 'culturalMap.verifyErrorNotFound',
          offline: 'culturalMap.verifyErrorOffline',
        };
        setMessage(t(reasonKey[result.reason]));
      }
    } catch {
      setMessageIsError(true);
      setMessage(t('culturalMap.locationFetchFailed'));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('culturalMap.pinDetailTitle')} showBack />
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="flex-row items-center mb-4">
          <View className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center mr-3">
            <Feather name={(meta?.iconName as any) ?? 'map-pin'} size={19} color="#047857" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-gray-900">{pin.title}</Text>
            <Text className="text-xs text-gray-500">{meta?.label}{pin.address ? ` · ${pin.address}` : ''}</Text>
          </View>
        </View>

        <Text className="text-sm text-gray-700 leading-6 mb-5">{pin.story}</Text>

        <View className="flex-row items-center border-t border-gray-100 pt-4 mb-2">
          <Avatar uri={author?.avatarUrl} size={28} />
          <Text className="text-xs text-gray-500 ml-2 flex-1">
            {t('culturalMap.registeredBy', { name: author?.name ?? t('feed.neighborFallback') })}
          </Text>
          <View className="flex-row items-center bg-gray-50 rounded-full px-2.5 py-1">
            <Feather name="check-circle" size={11} color="#059669" />
            <Text className="text-[11px] font-semibold text-gray-600 ml-1">
              {t('culturalMap.verifiedCount', { count: pin.verifications.length })}
            </Text>
          </View>
        </View>

        {!!message && (
          <View className={`flex-row items-center rounded-2xl px-4 py-3 mt-4 ${messageIsError ? 'bg-red-50' : 'bg-primary-50'}`}>
            <Feather
              name={messageIsError ? 'alert-circle' : 'check-circle'}
              size={15}
              color={messageIsError ? '#ef4444' : '#059669'}
            />
            <Text className={`text-xs ml-2 flex-1 ${messageIsError ? 'text-red-500' : 'text-primary-700'}`}>
              {message}
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        {isAuthor ? (
          <>
            <View className="flex-row items-center justify-center py-4">
              <Feather name="star" size={15} color="#059669" />
              <Text className="text-sm font-semibold text-primary-700 ml-2">{t('culturalMap.isAuthorLabel')}</Text>
            </View>
            <Button
              label={t('common.delete')}
              variant="outline"
              onPress={() =>
                Alert.alert(t('common.deleteConfirmTitle'), t('common.deleteConfirmBody'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                      await deletePin(pin.id);
                      router.back();
                    },
                  },
                ])
              }
            />
          </>
        ) : (
          <Button
            label={
              alreadyVerified
                ? t('culturalMap.alreadyVerifiedLabel')
                : verifying
                  ? t('culturalMap.verifying')
                  : t('culturalMap.verifyButton')
            }
            onPress={handleVerify}
            loading={verifying}
            disabled={alreadyVerified || verifying}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
