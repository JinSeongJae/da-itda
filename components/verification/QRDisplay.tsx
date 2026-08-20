import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from '../../utils/i18n';

export function QRDisplay({ appointmentId, userId }: { appointmentId: string; userId: string }) {
  const { t } = useTranslation();
  return (
    <View className="items-center bg-gray-50 rounded-3xl p-6">
      <QRCode value={`daitda://checkin/${appointmentId}/${userId}`} size={180} color="#111827" backgroundColor="#fff" />
      <Text className="text-gray-400 text-xs mt-4">{t('meetupQr.myQrLabel')}</Text>
    </View>
  );
}
