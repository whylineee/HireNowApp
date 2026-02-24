import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import type { RecentSearch } from '@/hooks/useRecentSearches';

interface RecentSearchesProps {
  items: RecentSearch[];
  onSelect: (item: RecentSearch) => void;
  onClear?: () => void;
}

export function RecentSearches({ items, onSelect, onClear }: RecentSearchesProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Останні пошуки</Text>
        {onClear && (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Text style={styles.clear}>Очистити</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {items.map((item, index) => {
          const label = [item.query, item.location].filter(Boolean).join(' • ');
          return (
            <TouchableOpacity
              key={`${label}-${item.createdAt}-${index}`}
              style={styles.chip}
              onPress={() => onSelect(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={styles.chipText} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  title: { fontSize: typography.base, fontWeight: typography.semibold, color: colors.text },
  clear: { fontSize: typography.sm, color: colors.primary, fontWeight: typography.medium },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 1,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow.sm,
  },
  chipText: { fontSize: typography.sm, color: colors.textSecondary, maxWidth: 220 },
});
