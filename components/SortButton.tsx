import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type SortOption = 'recent' | 'salary-high' | 'salary-low' | 'title';

interface SortButtonProps {
  currentSort: SortOption;
  onPress: () => void;
}

export function SortButton({ currentSort, onPress }: SortButtonProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const sortLabels: Record<SortOption, string> = {
    recent: t('jobs.sortRecent'),
    'salary-high': t('jobs.sortSalaryHigh'),
    'salary-low': t('jobs.sortSalaryLow'),
    title: t('jobs.sortTitle'),
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Ionicons name="swap-vertical" size={18} color={colors.primary} />
      <Text style={styles.text}>{sortLabels[currentSort]}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 1,
      borderRadius: borderRadius.full,
      backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.94)',
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadow.sm,
    },
    text: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      fontWeight: typography.medium,
    },
  });
