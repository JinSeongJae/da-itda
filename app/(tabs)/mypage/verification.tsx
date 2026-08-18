import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/common/Button';
import { Header } from '../../../components/common/Header';
import { IDUploader } from '../../../components/mypage/IDUploader';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUserStore } from '../../../store/useUserStore';
import { useVerificationStore } from '../../../store/useVerificationStore';
import type { VerificationDocumentType } from '../../../types';

const DOC_TYPES: { value: VerificationDocumentType; label: string }[] = [
  { value: 'id-card', label: '주민등록증 / 운전면허증' },
  { value: 'foreign-registration-card', label: '외국인등록증' },
];

const STEPS = [
  { key: 'submit', label: '제출' },
  { key: 'review', label: '검토 중' },
  { key: 'done', label: '인증 완료' },
] as const;

export default function VerificationScreen() {
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const user = useUserStore((s) => s.usersById[currentUserId]);
  const submitVerification = useVerificationStore((s) => s.submitVerification);
  const mockAdminApprove = useVerificationStore((s) => s.mockAdminApprove);
  const mockAdminReject = useVerificationStore((s) => s.mockAdminReject);

  const [docType, setDocType] = useState<VerificationDocumentType>('id-card');
  const [imageUri, setImageUri] = useState<string | null>(null);

  if (!user) return null;

  const status = user.verification;
  const currentStepIndex = status === 'verified' ? 2 : status === 'pending' || status === 'rejected' ? 1 : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="수동 안심인증" showBack />
      <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-gray-500 text-sm mb-5">
          제출하신 서류는 OCR 자동 인식 없이, 운영팀이 직접 육안으로 확인 후 승인해드려요.
        </Text>

        <View className="flex-row items-center justify-center mb-6">
          {STEPS.map((step, i) => (
            <View key={step.key} className="flex-row items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${i <= currentStepIndex ? 'bg-primary-500' : 'bg-gray-200'}`}
              >
                {i < currentStepIndex ? (
                  <Feather name="check" size={14} color="#fff" />
                ) : (
                  <Text className={`text-xs font-bold ${i <= currentStepIndex ? 'text-white' : 'text-gray-500'}`}>{i + 1}</Text>
                )}
              </View>
              <Text className="text-[11px] text-gray-500 mx-1.5">{step.label}</Text>
              {i < STEPS.length - 1 && <View className="w-6 h-px bg-gray-300 mr-1.5" />}
            </View>
          ))}
        </View>

        {status === 'verified' ? (
          <View className="items-center bg-primary-50 rounded-2xl py-8">
            <Feather name="shield" size={36} color="#10b981" />
            <Text className="text-primary-700 font-bold mt-3">인증 완료 (안심인증 뱃지 부여)</Text>
          </View>
        ) : (
          <>
            <Text className="text-sm font-bold text-gray-700 mb-2">서류 종류</Text>
            <View className="flex-row mb-4 gap-2">
              {DOC_TYPES.map((d) => (
                <Pressable
                  key={d.value}
                  onPress={() => setDocType(d.value)}
                  className={`flex-1 rounded-xl py-2.5 items-center ${docType === d.value ? 'bg-primary-500' : 'bg-gray-100'}`}
                >
                  <Text className={`text-xs font-semibold ${docType === d.value ? 'text-white' : 'text-gray-600'}`}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <IDUploader onPicked={setImageUri} />

            {status === 'pending' && (
              <Text className="text-amber-600 text-xs text-center mt-3">
                검토 대기 중이에요. 영업일 기준 1~2일 이내 완료돼요.
              </Text>
            )}
            {status === 'rejected' && (
              <Text className="text-red-500 text-xs text-center mt-3">
                반려되었어요. 서류를 다시 확인 후 제출해주세요.
              </Text>
            )}

            <Button
              label={status === 'pending' ? '재제출하기' : '제출하기'}
              className="mt-4"
              disabled={!imageUri}
              onPress={() => imageUri && submitVerification(currentUserId, docType, imageUri)}
            />

            {status === 'pending' && (
              <View className="mt-8 p-3 bg-gray-50 rounded-2xl">
                <Text className="text-xs font-bold text-gray-400 mb-2">DEV TOOLS (관리자 검토 시뮬레이션)</Text>
                <View className="flex-row gap-2">
                  <Button
                    label="승인 처리"
                    variant="outline"
                    fullWidth={false}
                    className="flex-1"
                    onPress={() => mockAdminApprove(currentUserId)}
                  />
                  <Button
                    label="반려 처리"
                    variant="outline"
                    fullWidth={false}
                    className="flex-1 ml-2"
                    onPress={() => mockAdminReject(currentUserId)}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
