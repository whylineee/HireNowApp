import { EmptyState } from '@/components/EmptyState';
import { FilterChips } from '@/components/FilterChips';
import { JobCard } from '@/components/job/JobCard';
import { QuickFilters } from '@/components/QuickFilters';
import { RecentSearches } from '@/components/RecentSearches';
import { SearchBar } from '@/components/SearchBar';
import { SearchStats } from '@/components/SearchStats';
import { SortButton, type SortOption } from '@/components/SortButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useFavorites } from '@/hooks/useFavorites';
import { useJobs } from '@/hooks/useJobs';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTranslation } from '@/hooks/useTranslation';
import type { JobType } from '@/types/job';
import { extractSalary } from '@/utils/salary';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type WorkerTab = 'search' | 'profile';

interface WorkerHomeProps {
  userName: string;
  onUpdateProfile: (patch: { headline?: string; about?: string; skills?: string[]; experience?: string }) => void;
  onTabChange?: (tab: 'search' | 'profile') => void;
}

export function WorkerHome({ userName, onUpdateProfile, onTabChange }: WorkerHomeProps) {
  const { t } = useTranslation();
  const { jobs, loading, error, search, refetch } = useJobs();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isApplied } = useApplications();
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | undefined>();
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<WorkerTab>('search');
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [experience, setExperience] = useState('');

  const handleTabChange = useCallback((newTab: WorkerTab) => {
    setTab(newTab);
    onTabChange?.(newTab);
  }, [onTabChange]);

  const handleSearch = useCallback(() => {
    addSearch({ query, location });
    search({
      query: query.trim() || undefined,
      location: location.trim() || undefined,
      type: selectedType,
    });
  }, [query, location, selectedType, search, addSearch]);

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
    addSearch({ query: newQuery, location: newLocation });
    search({
      query: newQuery || undefined,
      location: newLocation || undefined,
      type: selectedType,
    });
  }, [query, location, selectedType, search, addSearch]);

  const handleRecentSelect = useCallback((item: { query?: string; location?: string }) => {
    const nextQuery = item.query ?? '';
    const nextLocation = item.location ?? '';
    setQuery(nextQuery);
    setLocation(nextLocation);
    search({
      query: nextQuery || undefined,
      location: nextLocation || undefined,
      type: selectedType,
    });
  }, [search, selectedType]);

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
  }, [jobs, sortOption]);

  const cycleSort = useCallback(() => {
    const options: SortOption[] = ['recent', 'salary-high', 'salary-low', 'title'];
    const currentIndex = options.indexOf(sortOption);
    setSortOption(options[(currentIndex + 1) % options.length]);
  }, [sortOption]);

  const handleSaveProfile = useCallback(() => {
    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onUpdateProfile({
      headline: headline.trim() || undefined,
      about: about.trim() || undefined,
      skills: skills.length ? skills : undefined,
      experience: experience.trim() || undefined,
    });
  }, [headline, about, skillsText, experience, onUpdateProfile]);

  return (
    <View style={{ flex: 1, padding: spacing.md }}>
      <View style={styles.modeTabs}>
        <TouchableOpacity
          onPress={() => handleTabChange('search')}
          style={[styles.modeTab, tab === 'search' && styles.modeTabActive]}
        >
          <Text style={[styles.modeTabText, tab === 'search' && styles.modeTabTextActive]}>Пошук роботи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange('profile')}
          style={[styles.modeTab, tab === 'profile' && styles.modeTabActive]}
        >
          <Text style={[styles.modeTabText, tab === 'profile' && styles.modeTabTextActive]}>Моє резюме</Text>
        </TouchableOpacity>
      </View>

      {tab === 'profile' ? (
        <View style={styles.profileWrapper}>
          <Text style={styles.sectionTitle}>Заповніть резюме</Text>
          <Input
            label="Позиція / роль"
            placeholder="Наприклад: Junior React Native Developer"
            value={headline}
            onChangeText={setHeadline}
          />
          <Input
            label="Про себе"
            placeholder="Коротко опишіть свій досвід та цілі"
            value={about}
            onChangeText={setAbout}
            multiline
            numberOfLines={4}
          />
          <Input
            label="Навички"
            placeholder="React, TypeScript, Node.js..."
            value={skillsText}
            onChangeText={setSkillsText}
          />
          <Input
            label="Досвід"
            placeholder="Опишіть попередній досвід, проєкти, досягнення"
            value={experience}
            onChangeText={setExperience}
            multiline
            numberOfLines={4}
          />
          <Button title="Зберегти резюме" onPress={handleSaveProfile} fullWidth />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSearch={handleSearch}
            locationValue={location}
            onLocationChange={setLocation}
            showLocation
          />

          <RecentSearches items={recentSearches} onSelect={handleRecentSelect} onClear={clearSearches} />

          <View style={styles.searchActions}>
            <Button title="Шукати" onPress={handleSearch} fullWidth />
          </View>

          <QuickFilters onFilterPress={handleQuickFilter} />

          {jobs.length > 0 && (
            <View style={styles.resultsRow}>
              <SearchStats count={jobs.length} query={query} location={location} />
              <View style={styles.sortContainer}>
                <SortButton currentSort={sortOption} onPress={cycleSort} />
              </View>
            </View>
          )}

          <View style={styles.compactFilters}>
            <FilterChips selectedType={selectedType} onTypeChange={handleTypeChange} />
          </View>

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
                  isApplied={isApplied(item.id)}
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.md,
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.surface,
    ...colors.shadow.sm,
  },
  modeTabText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  modeTabTextActive: {
    color: colors.primary,
  },
  profileWrapper: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  searchActions: {
    marginBottom: spacing.md,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sortContainer: {
    marginLeft: spacing.sm,
  },
  compactFilters: {
    marginBottom: spacing.sm,
  },
  errorBox: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sm,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});

export default WorkerHome;
