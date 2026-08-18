import { View, type ViewProps } from 'react-native';

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`bg-gray-50 rounded-3xl p-4 ${className ?? ''}`}
      {...props}
    />
  );
}
