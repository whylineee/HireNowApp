import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

interface SearchStatsProps {
  count: number;
  query?: string;
  location?: string;
}

export function SearchStats({ count, query, location }: SearchStatsProps) {
  if (count === 0) return null;

  const hasFilters = query || location;

  return (
    <View style={styles.container}>
      <Text style={styles.count}>
        Знайдено <Text style={styles.countBold}>{count}</Text> {getPluralForm(count)}
      </Text>
      {hasFilters && (
        <Text style={styles.filters}>
          {query && `"${query}"`}
          {query && location && ' • '}
          {location && `📍 ${location}`}
        </Text>
      )}
    </View>
  );
}

function getPluralForm(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'вакансій';
  }

  if (lastDigit === 1) {
    return 'вакансія';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'вакансії';
  }

  return 'вакансій';
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  count: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  countBold: {
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  filters: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: spacing.xs / 2,
  },
});
