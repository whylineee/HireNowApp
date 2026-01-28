import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/job/JobCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { createEmployerJob, getEmployerJobs } from '@/services/jobs';
import type { Job, JobType } from '@/types/job';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.container}>
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
            placeholder={'Кожна вимога з нового рядка\\nReact Native\\nTypeScript\\nREST API'}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchActions: {
    marginBottom: spacing.md,
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
  profileWrapper: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});

export default EmployerHome;
