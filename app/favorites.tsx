import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/job/JobCard';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { getJobById } from '@/services/jobs';
import type { Job } from '@/types/job';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { isApplied } = useApplications();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const favoritesKey = useMemo(() => favorites.join(','), [favorites]);

  const loadFavoriteJobs = useCallback(async () => {
    if (favorites.length === 0) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const jobsData = await Promise.all(
        favorites.map((id) => getJobById(id))
      );
      setJobs(jobsData.filter((job): job is Job => job !== null));
    } catch (error) {
      console.error('Помилка завантаження збережених вакансій:', error);
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  useEffect(() => {
    loadFavoriteJobs();
  }, [loadFavoriteJobs, favoritesKey]);

  if (!user) {
    return (
      <Screen>
        <Card style={styles.authCard}>
          <Text style={styles.authText}>Будь ласка, зареєструйтесь для доступу</Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            title: 'Збережені',
            headerBackTitle: 'Назад',
          }}
        />
        <Header title="Збережені вакансії" subtitle={`${favorites.length} збережено`} showSettingsButton />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Завантаження...</Text>
          </View>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Немає збережених вакансій"
            subtitle="Додавайте вакансії до збережених, натискаючи на іконку серця на картці вакансії"
            icon="heart-outline"
          />
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JobCard
                job={item}
                isApplied={isApplied(item.id)}
                isFavorite={true}
                onFavoritePress={() => toggleFavorite(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  authCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authText: {
    fontSize: typography.base,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
});
