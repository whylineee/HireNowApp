import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/job/JobCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { createEmployerJob, getEmployerJobs } from '@/services/jobs';
import type { Job, JobType } from '@/types/job';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

function EmployerHome() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
          <View style={styles.heroIntro}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{t('home.employerHeroBadge')}</Text>
            </View>
            <Text style={styles.heroTitle}>{t('home.employerHeroTitle')}</Text>
            <Text style={styles.heroSubtitle}>{t('home.employerHeroSubtitle')}</Text>
          </View>

          <View style={styles.searchActions}>
            <Button title={t('jobs.newVacancy')} onPress={() => setCreating(true)} fullWidth />
          </View>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>{t('jobs.loadingJobs')}</Text>
            </View>
          ) : jobs.length === 0 ? (
            <EmptyState title={t('jobs.noVacanciesYet')} subtitle={t('jobs.noVacanciesSubtitle')} icon="briefcase-outline" />
          ) : (
            <FlatList
              data={jobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <JobCard job={item} isFavorite={false} isApplied={false} showFavorite={false} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      ) : (
        <Card style={styles.profileWrapper}>
          <Text style={styles.sectionTitle}>{t('jobs.newVacancy')}</Text>
          <Input label={t('jobForm.title')} placeholder={t('jobForm.titlePlaceholder')} value={title} onChangeText={setTitle} />
          <Input
            label={t('jobForm.company')}
            placeholder={t('jobForm.companyPlaceholder')}
            value={company}
            onChangeText={setCompany}
          />
          <Input
            label={t('jobForm.location')}
            placeholder={t('jobForm.locationPlaceholder')}
            value={location}
            onChangeText={setLocation}
          />
          <Input label={t('jobForm.salary')} placeholder={t('jobForm.salaryPlaceholder')} value={salary} onChangeText={setSalary} />
          <Input
            label={t('jobForm.employmentType')}
            placeholder={t('jobForm.employmentTypePlaceholder')}
            value={type}
            onChangeText={(text) => setType(text as JobType)}
          />
          <Input
            label={t('jobForm.description')}
            placeholder={t('jobForm.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          <Input
            label={t('jobForm.requirements')}
            placeholder={t('jobForm.requirementsPlaceholder')}
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={4}
          />
          <View style={styles.searchActions}>
            <Button title={t('jobForm.createVacancy')} onPress={handleCreate} fullWidth />
          </View>
          <Button title={t('common.cancel')} onPress={() => setCreating(false)} variant="ghost" fullWidth />
        </Card>
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    heroIntro: {
      marginBottom: spacing.md,
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
      marginTop: spacing.xs,
    },
    sectionTitle: {
      fontSize: typography.base,
      fontWeight: typography.bold,
      color: colors.text,
      marginBottom: spacing.md,
    },
  });

export default EmployerHome;
