import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { LOCALES, LOCALE_LABELS } from '../../constants/i18n';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useTranslation } from '../../utils/i18n';

export function LanguagePicker() {
  const [open, setOpen] = useState(false);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const { t } = useTranslation();

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center bg-gray-50 rounded-full px-3 py-1.5"
      >
        <Feather name="globe" size={13} color="#6b7280" />
        <Text className="text-[13px] font-semibold text-gray-600 ml-1.5">{LOCALE_LABELS[locale]}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/30 justify-end" onPress={() => setOpen(false)}>
          <View className="bg-white rounded-t-[28px] px-6 pt-7 pb-8">
            <Text className="text-xl font-extrabold text-gray-900 mb-5">{t('languagePicker.title')}</Text>
            {LOCALES.map((code) => (
              <Pressable
                key={code}
                onPress={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className="py-4 flex-row items-center justify-between"
              >
                <Text className={`text-base ${locale === code ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                  {LOCALE_LABELS[code]}
                </Text>
                {locale === code && <Feather name="check" size={18} color="#10b981" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
