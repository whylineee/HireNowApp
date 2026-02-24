import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/job/JobCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { getJobById } from '@/services/jobs';
import type { Job } from '@/types/job';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { isApplied } = useApplications();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
      const jobsData = await Promise.all(favorites.map((id) => getJobById(id)));
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
          <Text style={styles.authText}>{t('common.authRequired')}</Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header title={t('favorites.title')} subtitle={t('favorites.subtitleSaved', { count: favorites.length })} showBackButton />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{t('favorites.loading')}</Text>
          </View>
        ) : jobs.length === 0 ? (
          <EmptyState title={t('favorites.emptyTitle')} subtitle={t('favorites.emptySubtitle')} icon="heart-outline" />
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JobCard
                job={item}
                isApplied={isApplied(item.id)}
                isFavorite
                onFavoritePress={() => toggleFavorite(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <BottomNav />
    </Screen>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
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
      paddingBottom: spacing.xxl + 96,
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
