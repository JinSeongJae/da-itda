import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { NOTIFICATIONS } from '../../mocks/notifications';
import { formatRelativeTime } from '../../utils/formatters';

const DISTRICTS = ['중산동', '진량읍'];

export function LocationHeader({ city, district }: { city: string; district: string }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [selected, setSelected] = useState(district);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm shadow-gray-200">
      <Pressable
        onPress={() => setPickerOpen(true)}
        className="flex-row items-center bg-gray-50 rounded-full pl-3 pr-2.5 py-1.5"
      >
        <Feather name="map-pin" size={13} color="#059669" />
        <Text className="text-sm font-bold text-gray-800 ml-1.5">
          {city} {selected}
        </Text>
        <Feather name="chevron-down" size={16} color="#9ca3af" style={{ marginLeft: 2 }} />
      </Pressable>

      <Pressable onPress={() => setBellOpen(true)} hitSlop={12} className="relative">
        <Feather name="bell" size={22} color="#374151" />
        {unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-white text-[10px] font-bold">{unreadCount}</Text>
          </View>
        )}
      </Pressable>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable className="flex-1 bg-black/30 justify-end" onPress={() => setPickerOpen(false)}>
          <View className="bg-white rounded-t-3xl p-5">
            <Text className="text-base font-bold text-gray-800 mb-3">동네 선택</Text>
            {DISTRICTS.map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  setSelected(d);
                  setPickerOpen(false);
                }}
                className="py-3 flex-row items-center justify-between"
              >
                <Text className="text-base text-gray-800">
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
          <View className="bg-white rounded-t-3xl p-5 max-h-[70%]">
            <Text className="text-base font-bold text-gray-800 mb-3">알림</Text>
            {NOTIFICATIONS.map((n) => (
              <View key={n.id} className="py-3 border-b border-gray-100">
                <Text className="text-sm font-semibold text-gray-800">{n.title}</Text>
                <Text className="text-sm text-gray-500 mt-0.5">{n.body}</Text>
                <Text className="text-xs text-gray-400 mt-1">{formatRelativeTime(n.createdAt)}</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
