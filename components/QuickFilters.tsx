import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';

interface QuickFilter {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  query?: string;
  location?: string;
}

const QUICK_FILTERS: QuickFilter[] = [
  { id: 'kyiv', label: 'Київ', icon: 'location', location: 'Київ' },
  { id: 'lviv', label: 'Львів', icon: 'location', location: 'Львів' },
  { id: 'remote', label: 'Віддалено', icon: 'laptop', location: 'Віддалено' },
  { id: 'react', label: 'React', icon: 'code', query: 'React' },
  { id: 'nodejs', label: 'Node.js', icon: 'server', query: 'Node.js' },
  { id: 'python', label: 'Python', icon: 'code-slash', query: 'Python' },
];

interface QuickFiltersProps {
  onFilterPress: (filter: QuickFilter) => void;
}

export function QuickFilters({ onFilterPress }: QuickFiltersProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('jobs.searchJobs')}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {QUICK_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onFilterPress(filter)}
            style={styles.filter}
            activeOpacity={0.7}
          >
            <View style={styles.filterContent}>
              <Ionicons name={filter.icon} size={18} color={colors.primary} />
              <Text style={styles.filterText}>{filter.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.4,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filter: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 1,
    marginRight: spacing.sm,
    ...colors.shadow.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
});
