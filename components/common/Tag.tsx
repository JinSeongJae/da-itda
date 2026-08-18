import { Text, View } from 'react-native';

type TagTone = 'primary' | 'neutral' | 'warning' | 'danger';

const TONE_STYLES: Record<TagTone, { container: string; text: string }> = {
  primary: { container: 'bg-primary-100', text: 'text-primary-700' },
  neutral: { container: 'bg-gray-100', text: 'text-gray-600' },
  warning: { container: 'bg-amber-100', text: 'text-amber-700' },
  danger: { container: 'bg-red-100', text: 'text-red-700' },
};

export function Tag({ label, tone = 'primary' }: { label: string; tone?: TagTone }) {
  const styles = TONE_STYLES[tone];
  return (
    <View className={`rounded-full px-3 py-1 mr-2 mb-2 ${styles.container}`}>
      <Text className={`text-xs font-medium ${styles.text}`}>{label}</Text>
    </View>
  );
}
