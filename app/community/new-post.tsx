import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import type { TranslationKey } from '../../constants/i18n';
import { useAuthStore } from '../../store/useAuthStore';
import { useCommunityPostStore } from '../../store/useCommunityPostStore';
import type { CommunityPostCategory } from '../../types';
import { useTranslation } from '../../utils/i18n';

const CATEGORY_OPTIONS: { value: CommunityPostCategory; key: TranslationKey }[] = [
  { value: 'exchange', key: 'feed.category.exchange' },
  { value: 'question', key: 'feed.category.question' },
  { value: 'group', key: 'feed.category.group' },
];

export default function NewPostScreen() {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((s) => s.currentUserId)!;
  const createPost = useCommunityPostStore((s) => s.createPost);

  const [category, setCategory] = useState<CommunityPostCategory>('exchange');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createPost(currentUserId, { category, title: title.trim(), body: body.trim() });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={t('newPost.title')} showBack />
      <ScrollView className="flex-1 px-6 pt-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('newPost.categoryLabel')}</Text>
        <View className="flex-row mb-5">
          {CATEGORY_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setCategory(opt.value)}
              className={`rounded-full px-3.5 py-2 mr-2 border ${
                category === opt.value ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-xs font-semibold ${category === opt.value ? 'text-white' : 'text-gray-700'}`}>
                {t(opt.key)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('newPost.titleLabel')}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('newPost.titlePlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-5"
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('newPost.bodyLabel')}</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={6}
          placeholder={t('newPost.bodyPlaceholder')}
          placeholderTextColor="#9ca3af"
          className="border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-800 mb-2"
          textAlignVertical="top"
        />
      </ScrollView>

      <View className="px-6 pt-3 pb-4 border-t border-gray-100 bg-white">
        {!canSubmit && <Text className="text-xs text-gray-400 text-center mb-2">{t('newPost.validationHint')}</Text>}
        <Button label={t('newPost.submitButton')} disabled={!canSubmit} onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}
