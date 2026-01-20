import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ children, style, padded = true, elevated = true }: CardProps) {
  return (
    <View style={[styles.base, padded && styles.padded, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  padded: { padding: spacing.md },
  elevated: {
    ...colors.shadow.lg,
  },
});
