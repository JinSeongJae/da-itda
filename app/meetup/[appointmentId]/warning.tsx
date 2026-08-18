import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';

const NOTICE_ITEMS = [
  '반드시 앱에서 확정된 Safe Zone(안심존)에서만 만나주세요.',
  '무단 노쇼(No-show)가 반복될 경우 계정 이용이 제한될 수 있어요.',
  '본래 교류 목적과 다른 부적절한 언행이나 접근은 즉시 신고 및 제재 대상이 됩니다.',
  '만남 후에는 3초 매너 후기를 꼭 남겨주세요. 안전한 커뮤니티를 함께 만들어가요.',
];

export default function MeetupWarning() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const [checked, setChecked] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="만남 전 안내사항" showBack />
      <ScrollView className="flex-1 px-6 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="items-center mb-5">
          <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-3">
            <Feather name="alert-triangle" size={28} color="#b45309" />
          </View>
          <Text className="text-lg font-extrabold text-gray-800">안전한 만남을 위해 꼭 확인해주세요</Text>
        </View>

        {NOTICE_ITEMS.map((item, i) => (
          <View key={i} className="flex-row items-start mb-3.5">
            <View className="w-5 h-5 rounded-full bg-amber-100 items-center justify-center mr-2.5 mt-0.5">
              <Text className="text-amber-700 text-[10px] font-bold">{i + 1}</Text>
            </View>
            <Text className="text-sm text-gray-700 flex-1 leading-5">{item}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => setChecked((c) => !c)}
          className="flex-row items-center mt-6 mb-5 bg-gray-50 rounded-2xl p-4"
        >
          <View
            className={`w-5 h-5 rounded-md border-2 items-center justify-center mr-3 ${checked ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}
          >
            {checked && <Feather name="check" size={13} color="#fff" />}
          </View>
          <Text className="text-sm text-gray-700 flex-1">위 안내사항을 모두 확인했습니다.</Text>
        </Pressable>

        <Button
          label="계속하기"
          disabled={!checked}
          onPress={() => router.push(`/meetup/${appointmentId}/qr`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
