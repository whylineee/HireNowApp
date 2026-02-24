import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({ title, subtitle, icon = 'search-outline' }: EmptyStateProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl * 2,
      paddingHorizontal: spacing.xl,
    },
    iconContainer: {
      marginBottom: spacing.lg,
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: isDark ? 'rgba(96,165,250,0.18)' : 'rgba(219,234,254,0.9)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(96,165,250,0.35)' : 'rgba(59,130,246,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: typography.lg,
      fontWeight: typography.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
    },
  });
