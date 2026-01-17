import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { JOB_TYPE_LABELS, JOB_TYPE_COLORS } from '@/constants/job';
import type { Job } from '@/types/job';
import { colors, spacing, typography } from '@/constants/theme';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/job/${job.id}`)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <Text style={styles.location} numberOfLines={1}>📍 {job.location}</Text>
          <View style={[styles.badge, { backgroundColor: JOB_TYPE_COLORS[job.type] + '20' }]}>
            <Text style={[styles.badgeText, { color: JOB_TYPE_COLORS[job.type] }]}>
              {JOB_TYPE_LABELS[job.type]}
            </Text>
          </View>
        </View>

        {job.salary && (
          <Text style={styles.salary} numberOfLines={1}>💰 {job.salary}</Text>
        )}

        <Text style={styles.description} numberOfLines={2}>{job.description}</Text>
        <Text style={styles.posted}>{job.postedAt}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  headerText: { flex: 1 },
  title: { fontSize: typography.lg, fontWeight: typography.semibold, color: colors.text },
  company: { fontSize: typography.sm, color: colors.primary, marginTop: 2, fontWeight: typography.medium },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  location: { fontSize: typography.sm, color: colors.textSecondary, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: typography.xs, fontWeight: typography.medium },
  salary: { fontSize: typography.sm, color: colors.textSecondary, marginBottom: 6 },
  description: { fontSize: typography.sm, color: colors.textMuted, lineHeight: 20 },
  posted: { fontSize: typography.xs, color: colors.textMuted, marginTop: 8 },
});
