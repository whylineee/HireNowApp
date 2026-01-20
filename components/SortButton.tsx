import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export type SortOption = 'recent' | 'salary-high' | 'salary-low' | 'title';

const SORT_LABELS: Record<SortOption, string> = {
  recent: 'Нещодавні',
  'salary-high': 'Зарплата ↓',
  'salary-low': 'Зарплата ↑',
  title: 'Назва А-Я',
};

interface SortButtonProps {
  currentSort: SortOption;
  onPress: () => void;
}

export function SortButton({ currentSort, onPress }: SortButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Ionicons name="swap-vertical" size={18} color={colors.primary} />
      <Text style={styles.text}>{SORT_LABELS[currentSort]}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...colors.shadow.sm,
  },
  text: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.medium,
  },
});

export { SORT_LABELS };
