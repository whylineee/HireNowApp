import type { RecentSearch } from '@/hooks/useRecentSearches';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecentSearchesProps {
  items: RecentSearch[];
  onSelect: (item: RecentSearch) => void;
  onClear?: () => void;
}

export function RecentSearches({ items, onSelect, onClear }: RecentSearchesProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('jobs.recentSearches')}</Text>
        {onClear && (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Text style={styles.clear}>{t('common.clear')}</Text>
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
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
      backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.94)',
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadow.sm,
    },
    chipText: { fontSize: typography.sm, color: colors.textSecondary, maxWidth: 220 },
  });
