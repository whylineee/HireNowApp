import { EmptyState } from '@/components/EmptyState';
import { FilterChips } from '@/components/FilterChips';
import { JobCard } from '@/components/job/JobCard';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { QuickFilters } from '@/components/QuickFilters';
import { RecentSearches } from '@/components/RecentSearches';
import { SearchBar } from '@/components/SearchBar';
import { SearchStats } from '@/components/SearchStats';
import { SortButton, type SortOption } from '@/components/SortButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useJobs } from '@/hooks/useJobs';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTranslation } from '@/hooks/useTranslation';
import { createEmployerJob, getEmployerJobs } from '@/services/jobs';
import type { Job, JobType } from '@/types/job';
import type { UserRole } from '@/types/user';
import { extractSalary } from '@/utils/salary';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type WorkerTab = 'search' | 'profile';

export default function HomeScreen() {
  const { user, register, updateUser } = useAuth();

  if (!user) {
    return <RegistrationScreen onRegister={register} />;
  }

  if (user.role === 'employer') {
    return <EmployerHome />;
  }

  return <WorkerHome userName={user.name} onUpdateProfile={updateUser} />;
}

interface RegistrationProps {
  onRegister: (params: { name: string; role: UserRole }) => void;
}

function RegistrationScreen({ onRegister }: RegistrationProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(t('auth.nameRequired'));
      return;
    }
    onRegister({ name: name.trim(), role });
  };

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Header title="HireNow" subtitle="Створи акаунт та обери свою роль" showSettingsButton />
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Хто ви?</Text>
          <View style={styles.roleSwitch}>
            <TouchableOpacity
              style={[styles.rolePill, role === 'worker' && styles.rolePillActive]}
              onPress={() => setRole('worker')}
            >
              <Text style={[styles.rolePillText, role === 'worker' && styles.rolePillTextActive]}>
                Я шукаю роботу
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rolePill, role === 'employer' && styles.rolePillActive]}
              onPress={() => setRole('employer')}
            >
              <Text style={[styles.rolePillText, role === 'employer' && styles.rolePillTextActive]}>
                Я роботодавець
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Ваше імʼя"
            placeholder="Як до вас звертатися?"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError(null);
            }}
            error={error ?? undefined}
            autoCapitalize="words"
          />

          <Button
            title={role === 'worker' ? 'Почати пошук роботи' : 'Перейти до кабінету роботодавця'}
            onPress={handleSubmit}
            fullWidth
          />
        </View>
      </View>
      <BottomNav />
    </Screen>
  );
}

interface WorkerHomeProps {
  userName: string;
  onUpdateProfile: (patch: { headline?: string; about?: string; skills?: string[]; experience?: string }) => void;
}

function WorkerHome({ userName, onUpdateProfile }: WorkerHomeProps) {
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
  }, [jobs, sortOption, extractSalary]);

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
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header
          title="HireNow"
          subtitle={`Привіт, ${userName}!`}
          showFavoritesButton
          showSettingsButton
        />

      <View style={styles.modeTabs}>
        <TouchableOpacity
          onPress={() => setTab('search')}
          style={[styles.modeTab, tab === 'search' && styles.modeTabActive]}
        >
          <Text style={[styles.modeTabText, tab === 'search' && styles.modeTabTextActive]}>Пошук роботи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('profile')}
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
        <>
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
        </>
      )}
      </View>
      <BottomNav />
    </Screen>
  );
}

function EmployerHome() {
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState<JobType>('full-time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEmployerJobs();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleCreate = async () => {
    if (!title.trim() || !company.trim() || !location.trim()) {
      return;
    }
    const reqs = requirements
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    const job = await createEmployerJob({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      salary: salary.trim() || undefined,
      type,
      description: description.trim() || 'Опис не вказано',
      requirements: reqs.length ? reqs : ['Вимоги не вказані'],
    });
    setJobs((prev) => [job, ...prev]);
    setCreating(false);
    setTitle('');
    setCompany('');
    setLocation('');
    setSalary('');
    setDescription('');
    setRequirements('');
  };

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header
          title="Кабінет роботодавця"
          subtitle="Створюйте та керуйте своїми вакансіями"
          showSettingsButton
        />

      {!creating ? (
        <>
          <View style={styles.searchActions}>
            <Button title="Нова вакансія" onPress={() => setCreating(true)} fullWidth />
          </View>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Завантаження вакансій...</Text>
            </View>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="Ще немає вакансій"
              subtitle="Створіть свою першу вакансію, щоб кандидати могли відгукнутися"
              icon="briefcase-outline"
            />
          ) : (
            <FlatList
              data={jobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <JobCard job={item} isFavorite={false} isApplied={false} showFavorite={false} />
              )}
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      ) : (
        <View style={styles.profileWrapper}>
          <Text style={styles.sectionTitle}>Нова вакансія</Text>
          <Input
            label="Посада"
            placeholder="Наприклад: Middle React Native Developer"
            value={title}
            onChangeText={setTitle}
          />
          <Input
            label="Компанія"
            placeholder="Назва компанії"
            value={company}
            onChangeText={setCompany}
          />
          <Input
            label="Локація"
            placeholder="Місто / Віддалено"
            value={location}
            onChangeText={setLocation}
          />
          <Input
            label="Зарплата (необовʼязково)"
            placeholder="₴60 000 – ₴90 000"
            value={salary}
            onChangeText={setSalary}
          />
          <Input
            label="Тип зайнятості"
            placeholder="full-time, remote тощо"
            value={type}
            onChangeText={(text) => setType(text as JobType)}
          />
          <Input
            label="Опис"
            placeholder="Опишіть роль, команду та стек"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          <Input
            label="Вимоги"
            placeholder={'Кожна вимога з нового рядка\nReact Native\nTypeScript\nREST API'}
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={4}
          />
          <View style={styles.searchActions}>
            <Button title="Створити вакансію" onPress={handleCreate} fullWidth />
          </View>
          <Button title="Скасувати" onPress={() => setCreating(false)} variant="ghost" fullWidth />
        </View>
      )}
      </View>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    ...colors.shadow.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchActions: { marginBottom: spacing.md },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  sortContainer: { marginLeft: spacing.sm },
  errorBox: { backgroundColor: '#FEE2E2', padding: spacing.md, borderRadius: 8, marginBottom: spacing.md },
  errorText: { color: colors.error, fontSize: typography.sm },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl },
  loadingText: { marginTop: spacing.sm, fontSize: typography.sm, color: colors.textSecondary },
  listContent: { paddingBottom: spacing.xxl },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    padding: 4,
    marginBottom: spacing.md,
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing.sm,
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
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    padding: 4,
    marginBottom: spacing.lg,
  },
  rolePill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    alignItems: 'center',
  },
  rolePillActive: {
    backgroundColor: colors.primary,
  },
  rolePillText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  rolePillTextActive: {
    color: '#fff',
  },
  compactFilters: {
    marginBottom: spacing.sm,
  },
});
