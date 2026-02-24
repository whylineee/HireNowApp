import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: object;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput style={[styles.input, error ? styles.inputError : null]} placeholderTextColor={colors.textMuted} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    wrapper: { marginBottom: spacing.md },
    label: {
      fontSize: typography.sm,
      fontWeight: typography.medium,
      color: colors.textSecondary,
      marginBottom: spacing.xs + 2,
    },
    input: {
      backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.96)',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 3,
      fontSize: typography.sm,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
      borderWidth: 1.5,
    },
    error: {
      fontSize: typography.xs,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });
