import { borderRadius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ children, style, padded = true, elevated = true }: CardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return <View style={[styles.base, padded && styles.padded, elevated && styles.elevated, style]}>{children}</View>;
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    base: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    padded: { padding: spacing.md },
    elevated: {
      ...colors.shadow.sm,
    },
  });
