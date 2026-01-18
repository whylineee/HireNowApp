import { EmptyState } from '@/components/EmptyState';
import { FilterChips } from '@/components/FilterChips';
import { JobCard } from '@/components/job/JobCard';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { QuickFilters } from '@/components/QuickFilters';
import { SearchBar } from '@/components/SearchBar';
import { SearchStats } from '@/components/SearchStats';
import { SortButton, type SortOption } from '@/components/SortButton';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';
import { useFavorites } from '@/hooks/useFavorites';
import { useJobs } from '@/hooks/useJobs';
import type { JobType } from '@/types/job';
import { extractSalary } from '@/utils/salary';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { jobs, loading, error, search, refetch } = useJobs();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | undefined>();
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = useCallback(() => {
    search({
      query: query.trim() || undefined,
      location: location.trim() || undefined,
      type: selectedType,
    });
  }, [query, location, selectedType, search]);

  const handleTypeChange = useCallback((type: JobType | undefined) => {
    setSelectedType(type);
    search({
      query: query.trim() || undefined,
      location: location.trim() || undefined,
      type,
    });
  }, [query, location, search]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleQuickFilter = useCallback((filter: { query?: string; location?: string }) => {
    const newQuery = filter.query || query;
    const newLocation = filter.location || location;
    setQuery(newQuery);
    setLocation(newLocation);
    search({
      query: newQuery || undefined,
      location: newLocation || undefined,
      type: selectedType,
    });
  }, [query, location, selectedType, search]);

  const sortedJobs = useMemo(() => {
    const sorted = [...jobs];
    switch (sortOption) {
      case 'salary-high':
        return sorted.sort((a, b) => {
          const aSalary = extractSalary(a.salary);
          const bSalary = extractSalary(b.salary);
          return bSalary - aSalary;
        });
      case 'salary-low':
        return sorted.sort((a, b) => {
          const aSalary = extractSalary(a.salary);
          const bSalary = extractSalary(b.salary);
          return aSalary - bSalary;
        });
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'recent':
      default:
        return sorted;
    }
  }, [jobs, sortOption, extractSalary]);

  const cycleSort = useCallback(() => {
    const options: SortOption[] = ['recent', 'salary-high', 'salary-low', 'title'];
    const currentIndex = options.indexOf(sortOption);
    setSortOption(options[(currentIndex + 1) % options.length]);
  }, [sortOption]);

  return (
    <Screen scroll={false}>
      <Header title="HireNow" subtitle="Знайди роботу мрії" showFavoritesButton />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSearch={handleSearch}
        locationValue={location}
        onLocationChange={setLocation}
        showLocation
      />

      <View style={styles.searchActions}>
        <Button title="Шукати" onPress={handleSearch} fullWidth />
      </View>

      <QuickFilters onFilterPress={handleQuickFilter} />

      <FilterChips selectedType={selectedType} onTypeChange={handleTypeChange} />

      {jobs.length > 0 && (
        <>
          <SearchStats count={jobs.length} query={query} location={location} />
          <View style={styles.sortContainer}>
            <SortButton currentSort={sortOption} onPress={cycleSort} />
          </View>
        </>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Завантаження вакансій...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              isFavorite={isFavorite(item.id)}
              onFavoritePress={() => toggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              title="Нічого не знайдено"
              subtitle="Спробуйте змінити пошуковий запит, локацію або використайте швидкі фільтри"
              icon="search-outline"
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchActions: { marginBottom: spacing.md },
  sortContainer: { marginBottom: spacing.md, paddingHorizontal: spacing.md },
  errorBox: { backgroundColor: '#FEE2E2', padding: spacing.md, borderRadius: 8, marginBottom: spacing.md },
  errorText: { color: colors.error, fontSize: typography.sm },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl },
  loadingText: { marginTop: spacing.sm, fontSize: typography.sm, color: colors.textSecondary },
  listContent: { paddingBottom: spacing.xxl },
});
