import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CONTAINER: Record<Variant, string> = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-primary-100 active:bg-primary-200',
  outline: 'bg-transparent border border-gray-300 active:bg-gray-50',
  ghost: 'bg-transparent active:bg-gray-100',
  danger: 'bg-red-500 active:bg-red-600',
};

const VARIANT_TEXT: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-primary-700',
  outline: 'text-gray-700',
  ghost: 'text-gray-700',
  danger: 'text-white',
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  className,
  ...props
}: ButtonProps & { className?: string }) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      disabled={isDisabled}
      className={`${fullWidth ? 'w-full' : ''} rounded-full px-5 py-4 items-center justify-center flex-row ${VARIANT_CONTAINER[variant]} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : '#10b981'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={`text-base font-bold ${VARIANT_TEXT[variant]}`}>{label}</Text>
    </Pressable>
  );
}
