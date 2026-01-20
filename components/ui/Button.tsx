import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'secondary' ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  primary: { backgroundColor: colors.primary, ...colors.shadow.md },
  secondary: { backgroundColor: colors.primaryDark },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },

  text: { fontSize: typography.base, fontWeight: typography.semibold },
  text_primary: { color: '#fff' },
  text_secondary: { color: '#fff' },
  text_outline: { color: colors.primary },
  text_ghost: { color: colors.primary },
});
