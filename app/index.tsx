import { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/SearchBar';
import { JobCard } from '@/components/job/JobCard';
import { Button } from '@/components/ui/Button';
import { useJobs } from '@/hooks/useJobs';
import { colors, spacing, typography } from '@/constants/theme';

export default function HomeScreen() {
  const { jobs, loading, error, search } = useJobs();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = useCallback(() => {
    search({ query: query.trim() || undefined, location: location.trim() || undefined });
  }, [query, location, search]);

  return (
    <Screen scroll={false}>
      <Header title="HireNow" subtitle="Знайди роботу мрії" />

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

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Завантаження вакансій...</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JobCard job={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Нічого не знайдено</Text>
              <Text style={styles.emptySubtitle}>
                Спробуйте змінити пошуковий запит або локацію
              </Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchActions: { marginBottom: spacing.md },
  errorBox: { backgroundColor: '#FEE2E2', padding: spacing.md, borderRadius: 8, marginBottom: spacing.md },
  errorText: { color: colors.error, fontSize: typography.sm },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl },
  loadingText: { marginTop: spacing.sm, fontSize: typography.sm, color: colors.textSecondary },
  listContent: { paddingBottom: spacing.xxl },
  empty: { paddingVertical: spacing.xxl, alignItems: 'center' },
  emptyTitle: { fontSize: typography.lg, fontWeight: typography.semibold, color: colors.text },
  emptySubtitle: { fontSize: typography.sm, color: colors.textMuted, marginTop: 4 },
});
