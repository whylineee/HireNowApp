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
import { spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useFavorites } from '@/hooks/useFavorites';
import { useJobs } from '@/hooks/useJobs';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import type { JobType } from '@/types/job';
import type { User } from '@/types/user';
import { extractSalary } from '@/utils/salary';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type WorkerTab = 'search' | 'profile';

interface WorkerHomeProps {
  userName: string;
  profile?: Pick<User, 'headline' | 'about' | 'skills' | 'experience' | 'photoUri'>;
  onUpdateProfile: (patch: Partial<User>) => void;
  onTabChange?: (tab: 'search' | 'profile') => void;
}

export function WorkerHome({ userName, profile, onUpdateProfile, onTabChange }: WorkerHomeProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const { jobs, loading, error, search, refetch } = useJobs();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isApplied } = useApplications();
  const { preferences } = useUserPreferences();
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

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minSalaryText, setMinSalaryText] = useState('');
  const [maxSalaryText, setMaxSalaryText] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [excludeApplied, setExcludeApplied] = useState(preferences.hideAppliedJobs);
  const [remoteOnly, setRemoteOnly] = useState(preferences.remoteOnlySearch);

  useEffect(() => {
    setHeadline(profile?.headline ?? '');
    setAbout(profile?.about ?? '');
    setSkillsText(profile?.skills?.join(', ') ?? '');
    setExperience(profile?.experience ?? '');
  }, [profile?.about, profile?.experience, profile?.headline, profile?.skills]);

  useEffect(() => {
    setExcludeApplied(preferences.hideAppliedJobs);
    setRemoteOnly(preferences.remoteOnlySearch);
  }, [preferences.hideAppliedJobs, preferences.remoteOnlySearch]);

  const handleTabChange = useCallback(
    (newTab: WorkerTab) => {
      setTab(newTab);
      onTabChange?.(newTab);
    },
    [onTabChange]
  );

  const handleSearch = useCallback(() => {
    addSearch({ query, location });
    search({
      query: query.trim() || undefined,
      location: location.trim() || undefined,
      type: selectedType,
    });
  }, [query, location, selectedType, search, addSearch]);

  const handleTypeChange = useCallback(
    (type: JobType | undefined) => {
      setSelectedType(type);
      search({
        query: query.trim() || undefined,
        location: location.trim() || undefined,
        type,
      });
    },
    [query, location, search]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleQuickFilter = useCallback(
    (filter: { query?: string; location?: string }) => {
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
    },
    [query, location, selectedType, search, addSearch]
  );

  const handleRecentSelect = useCallback(
    (item: { query?: string; location?: string }) => {
      const nextQuery = item.query ?? '';
      const nextLocation = item.location ?? '';
      setQuery(nextQuery);
      setLocation(nextLocation);
      search({
        query: nextQuery || undefined,
        location: nextLocation || undefined,
        type: selectedType,
      });
    },
    [search, selectedType]
  );

  const sortedJobs = useMemo(() => {
    const sorted = [...jobs];
    switch (sortOption) {
      case 'salary-high':
        return sorted.sort((a, b) => extractSalary(b.salary) - extractSalary(a.salary));
      case 'salary-low':
        return sorted.sort((a, b) => extractSalary(a.salary) - extractSalary(b.salary));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'recent':
      default:
        return sorted;
    }
  }, [jobs, sortOption]);

  const filteredJobs = useMemo(() => {
    const minSalary = Number(minSalaryText.replace(/\D/g, ''));
    const maxSalary = Number(maxSalaryText.replace(/\D/g, ''));

    return sortedJobs.filter((job) => {
      const salary = extractSalary(job.salary);

      if (minSalaryText && salary > 0 && salary < minSalary) {
        return false;
      }

      if (maxSalaryText && salary > 0 && maxSalary > 0 && salary > maxSalary) {
        return false;
      }

      if (onlyFavorites && !isFavorite(job.id)) {
        return false;
      }

      if (excludeApplied && isApplied(job.id)) {
        return false;
      }

      if (remoteOnly) {
        const normalizedLocation = job.location.toLowerCase();
        const isRemoteLocation = normalizedLocation.includes('віддал') || normalizedLocation.includes('remote');
        if (job.type !== 'remote' && !isRemoteLocation) {
          return false;
        }
      }

      return true;
    });
  }, [excludeApplied, isApplied, isFavorite, maxSalaryText, minSalaryText, onlyFavorites, remoteOnly, sortedJobs]);

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

  const clearAdvancedFilters = useCallback(() => {
    setMinSalaryText('');
    setMaxSalaryText('');
    setOnlyFavorites(false);
    setExcludeApplied(false);
    setRemoteOnly(false);
  }, []);

  const renderSearchHeader = () => (
    <>
      <View style={styles.heroIntro}>
        <Text style={styles.userGreeting}>{userName}</Text>
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

      <Card style={styles.advancedFiltersCard}>
        <TouchableOpacity
          style={styles.advancedFiltersHeader}
          onPress={() => setShowAdvancedFilters((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.advancedFiltersTitle}>{t('jobs.filtersTitle')}</Text>
          <Text style={styles.advancedFiltersToggle}>{showAdvancedFilters ? t('common.hide') : t('common.edit')}</Text>
        </TouchableOpacity>

        {showAdvancedFilters && (
          <>
            <View style={styles.advancedFiltersRow}>
              <Input
                label={t('jobs.salaryFrom')}
                value={minSalaryText}
                onChangeText={setMinSalaryText}
                keyboardType="number-pad"
                containerStyle={styles.advancedInput}
              />
              <Input
                label={t('jobs.salaryTo')}
                value={maxSalaryText}
                onChangeText={setMaxSalaryText}
                keyboardType="number-pad"
                containerStyle={styles.advancedInput}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{t('jobs.onlyFavorites')}</Text>
              <Switch
                value={onlyFavorites}
                onValueChange={setOnlyFavorites}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={onlyFavorites ? colors.primary : colors.surface}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{t('jobs.hideApplied')}</Text>
              <Switch
                value={excludeApplied}
                onValueChange={setExcludeApplied}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={excludeApplied ? colors.primary : colors.surface}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{t('jobs.remoteOnly')}</Text>
              <Switch
                value={remoteOnly}
                onValueChange={setRemoteOnly}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={remoteOnly ? colors.primary : colors.surface}
              />
            </View>

            <Button title={t('common.clear')} variant="ghost" onPress={clearAdvancedFilters} fullWidth />
          </>
        )}
      </Card>

      {filteredJobs.length > 0 && (
        <View style={styles.resultsRow}>
          <SearchStats count={filteredJobs.length} query={query} location={location} />
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
    </>
  );

  const renderSearchListEmpty = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('jobs.loadingJobs')}</Text>
        </View>
      );
    }

    return <EmptyState title={t('jobs.nothingFound')} subtitle={t('jobs.nothingFoundSubtitle')} icon="search-outline" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeTabs}>
        <TouchableOpacity onPress={() => handleTabChange('search')} style={[styles.modeTab, tab === 'search' && styles.modeTabActive]}>
          <Text style={[styles.modeTabText, tab === 'search' && styles.modeTabTextActive]}>{t('jobs.searchJobs')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('profile')} style={[styles.modeTab, tab === 'profile' && styles.modeTabActive]}>
          <Text style={[styles.modeTabText, tab === 'profile' && styles.modeTabTextActive]}>{t('jobs.myResume')}</Text>
        </TouchableOpacity>
      </View>

      {tab === 'profile' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.profileContent}>
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
        </ScrollView>
      ) : (
        <FlatList
          data={loading && !refreshing ? [] : filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              isFavorite={isFavorite(item.id)}
              isApplied={isApplied(item.id)}
              onFavoritePress={() => toggleFavorite(item.id)}
            />
          )}
          style={styles.jobsList}
          ListHeaderComponent={renderSearchHeader}
          ListEmptyComponent={renderSearchListEmpty}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    modeTabs: {
      flexDirection: 'row',
      borderRadius: 999,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xs,
      marginBottom: spacing.md,
      ...colors.shadow.sm,
    },
    modeTab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: 999,
    },
    modeTabActive: {
      backgroundColor: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.12)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(96,165,250,0.5)' : 'rgba(37,99,235,0.2)',
    },
    modeTabText: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      fontWeight: typography.medium,
    },
    modeTabTextActive: {
      color: colors.primary,
      fontWeight: typography.semibold,
    },
    jobsList: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 136,
    },
    heroIntro: {
      marginBottom: spacing.md,
    },
    userGreeting: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontWeight: typography.medium,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 3,
      borderRadius: 16,
      backgroundColor: isDark ? 'rgba(96,165,250,0.18)' : 'rgba(219,234,254,0.9)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(96,165,250,0.35)' : 'rgba(59,130,246,0.2)',
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
    searchActions: {
      marginBottom: spacing.md,
    },
    advancedFiltersCard: {
      marginBottom: spacing.md,
    },
    advancedFiltersHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    advancedFiltersTitle: {
      fontSize: typography.base,
      fontWeight: typography.semibold,
      color: colors.text,
    },
    advancedFiltersToggle: {
      fontSize: typography.sm,
      color: colors.primary,
      fontWeight: typography.medium,
    },
    advancedFiltersRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    advancedInput: {
      flex: 1,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    switchLabel: {
      flex: 1,
      fontSize: typography.sm,
      color: colors.text,
      marginRight: spacing.md,
    },
    resultsRow: {
      flexDirection: 'row',
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
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.error,
      backgroundColor: isDark ? 'rgba(248,113,113,0.14)' : 'rgba(220,38,38,0.08)',
      borderRadius: 16,
      padding: spacing.sm,
    },
    errorText: {
      color: colors.error,
      fontSize: typography.sm,
    },
    centered: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    loadingText: {
      marginTop: spacing.sm,
      fontSize: typography.base,
      color: colors.textSecondary,
    },
    profileWrapper: {
      marginTop: spacing.xs,
    },
    profileContent: {
      paddingBottom: 136,
    },
    sectionTitle: {
      fontSize: typography.base,
      fontWeight: typography.bold,
      color: colors.text,
      marginBottom: spacing.md,
    },
  });

export default WorkerHome;
