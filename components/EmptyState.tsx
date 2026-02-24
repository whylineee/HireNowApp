import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({ title, subtitle, icon = 'search-outline' }: EmptyStateProps) {
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

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(219,234,254,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
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
