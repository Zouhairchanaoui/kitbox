import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-4',
  md: 'h-10 px-5',
  lg: 'h-12 px-6',
};

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: { container: 'bg-accent', text: 'text-on-accent' },
  secondary: { container: 'bg-transparent border border-border-input', text: 'text-text' },
  ghost: { container: 'bg-transparent', text: 'text-accent' },
  danger: { container: 'bg-danger', text: 'text-on-accent' },
};

// Button primitive — components.md "Button" block. Underlies the
// Install/Update button on the app card and detail screen.
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ...pressableProps
}: ButtonProps) {
  const v = variantClasses[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      className={`rounded-pill items-center justify-center flex-row gap-2 ${sizeClasses[size]} ${v.container} ${
        disabled ? 'opacity-40' : 'active:scale-[0.98]'
      }`}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'secondary' || variant === 'ghost' ? '#6D28D9' : '#ffffff'} />
      ) : null}
      <Text className={`text-sm font-semibold ${v.text}`}>{label}</Text>
    </Pressable>
  );
}
