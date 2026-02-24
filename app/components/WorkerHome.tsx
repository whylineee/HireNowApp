import { EmptyState } from '@/components/EmptyState';
import { FilterChips } from '@/components/FilterChips';
import { JobCard } from '@/components/job/JobCard';
import { QuickFilters } from '@/components/QuickFilters';
import { RecentSearches } from '@/components/RecentSearches';
import { SearchBar } from '@/components/SearchBar';
import { SearchStats } from '@/components/SearchStats';
import { SortButton, type SortOption } from '@/components/SortButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
          <Text style={[styles.modeTabText, tab === 'search' && styles.modeTabTextActive]}>{t('jobs.searchJobs')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange('profile')}
          style={[styles.modeTab, tab === 'profile' && styles.modeTabActive]}
        >
          <Text style={[styles.modeTabText, tab === 'profile' && styles.modeTabTextActive]}>{t('jobs.myResume')}</Text>
        </TouchableOpacity>
      </View>

      {tab === 'profile' ? (
        <Card style={styles.profileWrapper}>
          <Text style={styles.sectionTitle}>{t('jobs.myResume')}</Text>
          <Input
            label={t('jobs.position')}
            placeholder={t('jobs.positionPlaceholder')}
            value={headline}
            onChangeText={setHeadline}
          />
          <Input
            label={t('jobs.aboutYourself')}
            placeholder={t('jobs.aboutPlaceholder')}
            value={about}
            onChangeText={setAbout}
            multiline
            numberOfLines={4}
          />
          <Input
            label={t('jobs.skills')}
            placeholder={t('jobs.skillsPlaceholder')}
            value={skillsText}
            onChangeText={setSkillsText}
          />
          <Input
            label={t('jobs.experience')}
            placeholder={t('jobs.experiencePlaceholder')}
            value={experience}
            onChangeText={setExperience}
            multiline
            numberOfLines={4}
          />
          <Button title={t('jobs.saveResume')} onPress={handleSaveProfile} fullWidth />
        </Card>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.heroIntro}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{t('home.heroBadge')}</Text>
            </View>
            <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
            <Text style={styles.heroSubtitle}>{t('home.heroSubtitle')}</Text>
          </View>

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
            <Button title={t('common.search')} onPress={handleSearch} fullWidth />
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
              <Text style={styles.loadingText}>{t('jobs.loadingJobs')}</Text>
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
                  title={t('jobs.nothingFound')}
                  subtitle={t('jobs.nothingFoundSubtitle')}
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
  heroIntro: {
    marginBottom: spacing.md,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 3,
    borderRadius: 16,
    backgroundColor: 'rgba(219,234,254,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
    marginBottom: spacing.sm,
  },
  heroBadgeText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 31,
    letterSpacing: -0.6,
    fontWeight: typography.bold,
    color: colors.text,
  },
  heroSubtitle: {
    marginTop: spacing.xs,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing.sm + 1,
    borderRadius: 999,
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
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.md,
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
    backgroundColor: colors.error + '15',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error + '30',
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
