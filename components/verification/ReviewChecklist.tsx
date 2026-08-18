import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Button } from '../common/Button';
import { useTranslation } from '../../utils/i18n';

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
  const { t } = useTranslation();
  return (
    <View className={`rounded-2xl p-4 mb-3 ${warning ? 'bg-amber-50' : 'bg-gray-50'}`}>
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
          <Text className={`text-sm font-semibold ${value === true ? 'text-white' : 'text-gray-600'}`}>
            {t('review.yes')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onChange(false)}
          className={`flex-1 py-2.5 rounded-xl items-center ml-3 ${value === false ? 'bg-primary-500' : 'bg-white border border-gray-300'}`}
        >
          <Text className={`text-sm font-semibold ${value === false ? 'text-white' : 'text-gray-600'}`}>
            {t('review.no')}
          </Text>
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

  const { t } = useTranslation();
  const isComplete = Object.values(answers).every((v) => v !== null);

  return (
    <View>
      <YesNoRow
        question={t('review.q1')}
        value={answers.metAtSafeZone}
        onChange={(v) => setAnswers((a) => ({ ...a, metAtSafeZone: v }))}
      />
      <YesNoRow
        question={t('review.q2')}
        value={answers.exchangeWentWell}
        onChange={(v) => setAnswers((a) => ({ ...a, exchangeWentWell: v }))}
      />
      <YesNoRow
        question={t('review.q3')}
        value={answers.hadUncomfortableIncident}
        onChange={(v) => setAnswers((a) => ({ ...a, hadUncomfortableIncident: v }))}
        warning
      />
      <Text className="text-xs text-gray-400 mb-4 -mt-1">{t('review.warningHint')}</Text>
      <Button
        label={t('review.submit')}
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
