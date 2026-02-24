import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

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
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], fullWidth && styles.fullWidth, isDisabled && styles.disabled]}
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    base: {
      paddingVertical: spacing.sm + 3,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 46,
    },
    fullWidth: { width: '100%' },
    disabled: { opacity: 0.5 },

    primary: {
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(96,165,250,0.9)' : 'rgba(37,99,235,0.85)',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.38 : 0.25,
      shadowRadius: 16,
      elevation: 5,
    },
    secondary: {
      backgroundColor: colors.primaryDark,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(147,197,253,0.55)' : 'rgba(79,70,229,0.75)',
    },
    outline: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
    },

    text: {
      fontSize: typography.sm,
      fontWeight: typography.bold,
      letterSpacing: 0.1,
    },
    text_primary: {
      color: '#fff',
    },
    text_secondary: {
      color: '#fff',
    },
    text_outline: {
      color: colors.textSecondary,
    },
    text_ghost: {
      color: colors.primary,
    },
  });
