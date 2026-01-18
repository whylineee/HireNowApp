import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Share, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FavoriteButton } from '@/components/job/FavoriteButton';
import { getJobById } from '@/services/jobs';
import { useFavorites } from '@/hooks/useFavorites';
import { JOB_TYPE_LABELS, JOB_TYPE_COLORS } from '@/constants/job';
import type { Job } from '@/types/job';
import { colors, spacing, typography } from '@/constants/theme';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
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
    Alert.alert(
      'Відгукнутися',
      `Ви хочете відгукнутися на вакансію "${job?.title}" в ${job?.company}?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Відгукнутися',
          onPress: () => {
            // Тут можна додати логіку відгуку
            Alert.alert('Успіх', 'Ваш відгук відправлено!');
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
        <Text style={styles.errorText}>Не вказано ID вакансії</Text>
        <Button title="На головну" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Вакансія' }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Завантаження...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !job) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Помилка' }} />
        <Text style={styles.errorText}>{error || 'Вакансію не знайдено'}</Text>
        <Button title="Назад" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Stack.Screen
        options={{
          title: job.title,
          headerBackTitle: 'Назад',
          headerRight: () => (
            <View style={styles.headerActions}>
              <FavoriteButton
                isFavorite={isFavorite(job.id)}
                onPress={() => toggleFavorite(job.id)}
                size={24}
              />
            </View>
          ),
        }}
      />

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
        </View>

        {job.salary && (
          <Text style={styles.salary}>💰 {job.salary}</Text>
        )}

        <Text style={styles.posted}>Опубліковано: {job.postedAt}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Опис</Text>
        <Text style={styles.description}>{job.description}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Вимоги</Text>
        {job.requirements.map((req, i) => (
          <View key={i} style={styles.requirementRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.requirement}>{req}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.actions}>
        <Button title="Відгукнутися" onPress={handleApply} fullWidth />
        <View style={styles.shareButton}>
          <Button
            title="Поділитися"
            onPress={handleShare}
            fullWidth
            variant="outline"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerCard: { marginBottom: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleContainer: { flex: 1 },
  title: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.text },
  company: { fontSize: typography.lg, color: colors.primary, marginTop: 4, fontWeight: typography.medium },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.sm },
  location: { fontSize: typography.base, color: colors.textSecondary, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: typography.sm, fontWeight: typography.medium },
  salary: { fontSize: typography.base, color: colors.text, marginTop: 6, fontWeight: typography.medium },
  posted: { fontSize: typography.sm, color: colors.textMuted, marginTop: 6 },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.lg, fontWeight: typography.semibold, color: colors.text, marginBottom: spacing.sm },
  description: { fontSize: typography.base, color: colors.textSecondary, lineHeight: 24 },
  requirementRow: { flexDirection: 'row', marginBottom: 4 },
  bullet: { marginRight: 8, color: colors.primary, fontSize: typography.base },
  requirement: { flex: 1, fontSize: typography.base, color: colors.textSecondary, lineHeight: 22 },
  actions: { marginTop: spacing.sm },
  shareButton: { marginTop: spacing.sm },
  headerActions: { marginRight: spacing.sm },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl },
  loadingText: { marginTop: spacing.sm, fontSize: typography.sm, color: colors.textSecondary },
  errorText: { fontSize: typography.base, color: colors.error, marginBottom: spacing.md },
});
