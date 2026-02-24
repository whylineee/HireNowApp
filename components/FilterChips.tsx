import { TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JOB_TYPE_LABELS, JOB_TYPE_COLORS } from '@/constants/job';
import type { JobType } from '@/types/job';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface FilterChipsProps {
  selectedType?: JobType;
  onTypeChange: (type: JobType | undefined) => void;
}

const TYPE_ICONS: Record<JobType | 'all', keyof typeof Ionicons.glyphMap> = {
  'all': 'apps-outline',
  'full-time': 'briefcase-outline',
  'part-time': 'time-outline',
  'contract': 'document-text-outline',
  'remote': 'laptop-outline',
  'hybrid': 'swap-horizontal-outline',
};

export function FilterChips({ selectedType, onTypeChange }: FilterChipsProps) {
  const types: (JobType | 'all')[] = ['all', 'full-time', 'part-time', 'contract', 'remote', 'hybrid'];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {types.map((type) => {
        const isSelected = type === 'all' ? !selectedType : selectedType === type;
        const label = type === 'all' ? 'Всі' : JOB_TYPE_LABELS[type];
        const color = type === 'all' ? colors.primary : JOB_TYPE_COLORS[type];
        const icon = TYPE_ICONS[type];

        return (
          <TouchableOpacity
            key={type}
            onPress={() => onTypeChange(type === 'all' ? undefined : type)}
            activeOpacity={0.7}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              isSelected && { backgroundColor: color + '12', borderColor: color + '80' },
            ]}
          >
            <Ionicons
              name={icon}
              size={16}
              color={isSelected ? color : colors.textMuted}
              style={styles.icon}
            />
            <Text
              style={[
                styles.chipText,
                isSelected && { color, fontWeight: typography.semibold },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.94)',
    marginRight: spacing.sm,
    ...colors.shadow.sm,
  },
  chipSelected: {
    borderWidth: 1,
  },
  icon: {
    marginRight: spacing.xs,
  },
  chipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
});
