import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Button } from '../common/Button';

interface Answers {
  metAtSafeZone: boolean | null;
  exchangeWentWell: boolean | null;
  hadUncomfortableIncident: boolean | null;
}

function YesNoRow({
  question,
  value,
  onChange,
  warning,
}: {
  question: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  warning?: boolean;
}) {
  return (
    <View className={`rounded-2xl p-4 mb-3 ${warning ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
      <View className="flex-row items-start mb-3">
        {warning && <Feather name="alert-triangle" size={15} color="#b45309" style={{ marginTop: 2, marginRight: 6 }} />}
        <Text className={`text-sm font-semibold flex-1 ${warning ? 'text-amber-900' : 'text-gray-800'}`}>
          {question}
        </Text>
      </View>
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => onChange(true)}
          className={`flex-1 py-2.5 rounded-xl items-center ${value === true ? 'bg-primary-500' : 'bg-white border border-gray-300'}`}
        >
          <Text className={`text-sm font-semibold ${value === true ? 'text-white' : 'text-gray-600'}`}>예</Text>
        </Pressable>
        <Pressable
          onPress={() => onChange(false)}
          className={`flex-1 py-2.5 rounded-xl items-center ml-3 ${value === false ? 'bg-primary-500' : 'bg-white border border-gray-300'}`}
        >
          <Text className={`text-sm font-semibold ${value === false ? 'text-white' : 'text-gray-600'}`}>아니오</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ReviewChecklist({
  onSubmit,
}: {
  onSubmit: (answers: { metAtSafeZone: boolean; exchangeWentWell: boolean; hadUncomfortableIncident: boolean }) => void;
}) {
  const [answers, setAnswers] = useState<Answers>({
    metAtSafeZone: null,
    exchangeWentWell: null,
    hadUncomfortableIncident: null,
  });

  const isComplete = Object.values(answers).every((v) => v !== null);

  return (
    <View>
      <YesNoRow
        question="1. 약속된 Safe Zone에서 만났나요?"
        value={answers.metAtSafeZone}
        onChange={(v) => setAnswers((a) => ({ ...a, metAtSafeZone: v }))}
      />
      <YesNoRow
        question="2. 상호 재능 교류가 원활하게 이루어졌나요?"
        value={answers.exchangeWentWell}
        onChange={(v) => setAnswers((a) => ({ ...a, exchangeWentWell: v }))}
      />
      <YesNoRow
        question="3. 불쾌한 언행이나 본래 목적 외 접근이 있었나요?"
        value={answers.hadUncomfortableIncident}
        onChange={(v) => setAnswers((a) => ({ ...a, hadUncomfortableIncident: v }))}
        warning
      />
      <Text className="text-xs text-gray-400 mb-4 -mt-1">
        * 3번 질문은 부정적인 상황을 묻는 질문이에요. 안전한 만남이었다면 "아니오"를 선택해주세요.
      </Text>
      <Button
        label="후기 제출하기"
        disabled={!isComplete}
        onPress={() =>
          isComplete &&
          onSubmit({
            metAtSafeZone: answers.metAtSafeZone!,
            exchangeWentWell: answers.exchangeWentWell!,
            hadUncomfortableIncident: answers.hadUncomfortableIncident!,
          })
        }
      />
    </View>
  );
}
