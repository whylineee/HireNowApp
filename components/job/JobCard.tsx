import { Card } from '@/components/ui/Card';
import { JOB_TYPE_COLORS, JOB_TYPE_LABELS } from '@/constants/job';
import { colors, spacing, typography } from '@/constants/theme';
import type { Job } from '@/types/job';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FavoriteButton } from './FavoriteButton';

interface JobCardProps {
  job: Job;
  isFavorite?: boolean;
  isApplied?: boolean;
  onFavoritePress?: () => void;
  showFavorite?: boolean;
}

export function JobCard({
  job,
  isFavorite = false,
  isApplied = false,
  onFavoritePress,
  showFavorite = true,
}: JobCardProps) {
  const handleCardPress = () => {
    router.push(`/job/${job.id}`);
  };

  const handleFavoritePress = () => {
    onFavoritePress?.();
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handleCardPress}>
      <Card style={styles.card} elevated>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>
          </View>
          {showFavorite && (
            <FavoriteButton
              isFavorite={isFavorite}
              onPress={handleFavoritePress}
              size={22}
            />
          )}
        </View>

        <View style={styles.meta}>
          <Text style={styles.location} numberOfLines={1}>📍 {job.location}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: JOB_TYPE_COLORS[job.type] + '18' }]}>
              <Text style={[styles.badgeText, { color: JOB_TYPE_COLORS[job.type] }]}>
                {JOB_TYPE_LABELS[job.type]}
              </Text>
            </View>
            {isApplied && (
              <View style={styles.appliedBadge}>
                <Text style={styles.appliedText}>Відгукнуто</Text>
              </View>
            )}
          </View>
        </View>

        {job.salary && (
          <Text style={styles.salary} numberOfLines={1}>💰 {job.salary}</Text>
        )}

        <Text style={styles.description} numberOfLines={2}>{job.description}</Text>
        <Text style={styles.posted}>🕒 {job.postedAt}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    borderRadius: 24,
    borderColor: 'rgba(148,163,184,0.22)',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  headerText: { flex: 1, marginRight: spacing.sm },
  title: { fontSize: typography.base, fontWeight: typography.bold, color: colors.text, lineHeight: 21 },
  company: { fontSize: typography.sm, color: colors.textSecondary, marginTop: 3, fontWeight: typography.medium },
  meta: { marginBottom: spacing.xs + 2 },
  location: { fontSize: typography.sm, color: colors.textSecondary, marginBottom: 7 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(148,163,184,0.15)' },
  badgeText: { fontSize: typography.xs, fontWeight: typography.semibold },
  appliedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.success + '12',
  },
  appliedText: { fontSize: typography.xs, fontWeight: typography.semibold, color: colors.success },
  salary: { fontSize: typography.sm, color: colors.primaryDark, fontWeight: typography.semibold, marginBottom: 6 },
  description: { fontSize: typography.sm, color: colors.textSecondary, lineHeight: 20 },
  posted: { fontSize: typography.xs, color: colors.textMuted, marginTop: spacing.sm },
});
