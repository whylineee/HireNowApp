import { FavoriteButton } from '@/components/job/FavoriteButton';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { JOB_TYPE_COLORS, JOB_TYPE_LABELS } from '@/constants/job';
import { colors, spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from '@/hooks/useTranslation';
import { getJobById } from '@/services/jobs';
import type { Job } from '@/types/job';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Share, StyleSheet, Text, View } from 'react-native';

export default function JobDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isApplied, applyToJob } = useApplications();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (!job) return;
    try {
      await Share.share({
        message: `${job.title} в ${job.company}\n${job.location}\n\n${job.description}`,
        title: job.title,
      });
    } catch (error) {
      console.error('Помилка поділу:', error);
    }
  };

  const handleApply = () => {
    if (!job) return;
    if (isApplied(job.id)) {
      Alert.alert(t('jobDetails.alreadyAppliedTitle'), t('jobDetails.alreadyAppliedBody'));
      return;
    }
    Alert.alert(
      t('jobDetails.applyConfirmTitle'),
      t('jobDetails.applyConfirmBody', { title: job.title, company: job.company }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('jobDetails.apply'),
          onPress: () => {
            applyToJob(job.id);
            Alert.alert(t('jobDetails.applySuccessTitle'), t('jobDetails.applySuccessBody'));
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getJobById(id)
      .then((data) => {
        if (!cancelled) setJob(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Помилка завантаження');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (!id) {
    return (
      <Screen>
        <Text style={styles.errorText}>{t('jobDetails.missingId')}</Text>
        <Button title={t('jobDetails.backHome')} onPress={() => router.back()} />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <Header title={t('jobs.searchJobs')} showBackButton onBackPress={() => router.back()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('jobDetails.loading')}</Text>
        </View>
      </Screen>
    );
  }

  if (error || !job) {
    return (
      <Screen>
        <Header title={t('common.error')} showBackButton onBackPress={() => router.back()} />
        <Text style={styles.errorText}>{error || 'Вакансію не знайдено'}</Text>
        <Button title={t('jobDetails.back')} onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header
        title={job.title}
        subtitle={job.company}
        showBackButton
        onBackPress={() => router.back()}
      />

      <View style={styles.actionRowTop}>
        <FavoriteButton
          isFavorite={isFavorite(job.id)}
          onPress={() => toggleFavorite(job.id)}
          size={20}
        />
        <Button title={t('jobDetails.share')} onPress={handleShare} variant="outline" />
      </View>

      <Card style={styles.headerCard}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.location}>📍 {job.location}</Text>
          <View style={[styles.badge, { backgroundColor: JOB_TYPE_COLORS[job.type] + '25' }]}>
            <Text style={[styles.badgeText, { color: JOB_TYPE_COLORS[job.type] }]}>
              {JOB_TYPE_LABELS[job.type]}
            </Text>
          </View>
          {isApplied(job.id) && (
            <View style={styles.appliedBadge}>
              <Text style={styles.appliedText}>{t('jobDetails.applied')}</Text>
            </View>
          )}
        </View>

        {job.salary && (
          <Text style={styles.salary}>💰 {job.salary}</Text>
        )}

        <Text style={styles.posted}>{t('jobDetails.posted')} {job.postedAt}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('jobDetails.description')}</Text>
        <Text style={styles.description}>{job.description}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('jobDetails.requirements')}</Text>
        {job.requirements.map((req, i) => (
          <View key={i} style={styles.requirementRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.requirement}>{req}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.actions}>
        <Button
          title={isApplied(job.id) ? t('jobDetails.alreadyAppliedTitle') : t('jobDetails.apply')}
          onPress={handleApply}
          fullWidth
          disabled={isApplied(job.id)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerCard: { marginBottom: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleContainer: { flex: 1 },
  title: { fontSize: typography.lg, fontWeight: typography.bold, color: colors.text },
  company: { fontSize: typography.base, color: colors.textSecondary, marginTop: 4, fontWeight: typography.medium },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.sm },
  location: { fontSize: typography.sm, color: colors.textSecondary, flex: 1 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(148,163,184,0.2)' },
  badgeText: { fontSize: typography.xs, fontWeight: typography.semibold },
  appliedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.success + '12',
  },
  appliedText: { fontSize: typography.xs, fontWeight: typography.semibold, color: colors.success },
  salary: { fontSize: typography.sm, color: colors.primaryDark, marginTop: 6, fontWeight: typography.semibold },
  posted: { fontSize: typography.xs, color: colors.textMuted, marginTop: 8 },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.base, fontWeight: typography.bold, color: colors.text, marginBottom: spacing.sm },
  description: { fontSize: typography.sm, color: colors.textSecondary, lineHeight: 22 },
  requirementRow: { flexDirection: 'row', marginBottom: 4 },
  bullet: { marginRight: 8, color: colors.primary, fontSize: typography.sm },
  requirement: { flex: 1, fontSize: typography.sm, color: colors.textSecondary, lineHeight: 21 },
  actions: { marginTop: spacing.sm },
  actionRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl },
  loadingText: { marginTop: spacing.sm, fontSize: typography.sm, color: colors.textSecondary },
  errorText: { fontSize: typography.base, color: colors.error, marginBottom: spacing.md },
});
