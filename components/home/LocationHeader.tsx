import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { GYEONGSAN_DISTRICTS } from '../../constants/location';
import { NOTIFICATIONS } from '../../mocks/notifications';
import { formatRelativeTime } from '../../utils/formatters';
import { useTranslation } from '../../utils/i18n';

const DISTRICTS = GYEONGSAN_DISTRICTS;

export function LocationHeader({ city, district }: { city: string; district: string }) {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [selected, setSelected] = useState(district);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View className="flex-row items-center justify-between px-6 pt-2 pb-1 bg-white">
      <Pressable onPress={() => setPickerOpen(true)} className="flex-row items-center">
        <Text className="text-[15px] font-semibold text-gray-500">
          {city} {selected}
        </Text>
        <Feather name="chevron-down" size={16} color="#9ca3af" style={{ marginLeft: 2 }} />
      </Pressable>

      <Pressable onPress={() => setBellOpen(true)} hitSlop={12} className="relative">
        <Feather name="bell" size={21} color="#9ca3af" />
        {unreadCount > 0 && (
          <View className="absolute -top-0.5 -right-0.5 bg-primary-500 rounded-full w-2 h-2" />
        )}
      </Pressable>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable className="flex-1 bg-black/30 justify-end" onPress={() => setPickerOpen(false)}>
          <View className="bg-white rounded-t-[28px] px-6 pt-7 pb-8">
            <Text className="text-xl font-extrabold text-gray-900 mb-5">{t('locationHeader.pickTitle')}</Text>
            {DISTRICTS.map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  setSelected(d);
                  setPickerOpen(false);
                }}
                className="py-4 flex-row items-center justify-between"
              >
                <Text className={`text-base ${selected === d ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                  {city} {d}
                </Text>
                {selected === d && <Feather name="check" size={18} color="#10b981" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={bellOpen} transparent animationType="fade" onRequestClose={() => setBellOpen(false)}>
        <Pressable className="flex-1 bg-black/30 justify-end" onPress={() => setBellOpen(false)}>
          <View className="bg-white rounded-t-[28px] px-6 pt-7 pb-8 max-h-[70%]">
            <Text className="text-xl font-extrabold text-gray-900 mb-4">{t('locationHeader.notifTitle')}</Text>
            {NOTIFICATIONS.map((n) => (
              <View key={n.id} className="py-4 border-t border-gray-100">
                <Text className="text-[15px] font-semibold text-gray-800">{n.title}</Text>
                <Text className="text-sm text-gray-500 mt-1">{n.body}</Text>
                <Text className="text-xs text-gray-400 mt-1.5">{formatRelativeTime(n.createdAt)}</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
