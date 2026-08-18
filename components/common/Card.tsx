import { View, type ViewProps } from 'react-native';

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`bg-white rounded-3xl p-4 border border-gray-100/80 shadow-md shadow-gray-200 ${className ?? ''}`}
      {...props}
    />
  );
}
