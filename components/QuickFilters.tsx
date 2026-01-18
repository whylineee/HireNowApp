import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Швидкий пошук</Text>
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
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filter: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    ...colors.shadow.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterText: {
    fontSize: typography.sm,
    color: colors.text,
    fontWeight: typography.medium,
  },
});
