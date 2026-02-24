import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const { favorites } = useFavorites();
  const { applications } = useApplications();
  const { recentSearches } = useRecentSearches();
  const { preferences, setPreference } = useUserPreferences();
  const { t } = useTranslation();

  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');

  useEffect(() => {
    if (!user) return;
    setHeadline(user.headline ?? '');
    setAbout(user.about ?? '');
    setSkills(user.skills?.join(', ') ?? '');
    setExperience(user.experience ?? '');
  }, [user]);

  const stats = useMemo(
    () => [
      { key: 'favorites', label: t('profilePage.statFavorites'), value: favorites.length },
      { key: 'applications', label: t('profilePage.statApplications'), value: applications.length },
      { key: 'searches', label: t('profilePage.statSearches'), value: recentSearches.length },
    ],
    [applications.length, favorites.length, recentSearches.length, t]
  );

  const saveProfile = () => {
    if (!user) return;
    const nextSkills = skills
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    updateUser({
      headline: headline.trim() || undefined,
      about: about.trim() || undefined,
      skills: nextSkills.length ? nextSkills : undefined,
      experience: experience.trim() || undefined,
    });

    Alert.alert(t('common.done'), t('profilePage.profileSaved'));
  };

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), t('profilePage.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  if (!user) {
    return (
      <Screen>
        <Card style={styles.authCard}>
          <Text style={styles.authText}>{t('common.authRequired')}</Text>
        </Card>
        <BottomNav />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.page}>
        <Header
          title={t('profilePage.title')}
          subtitle={`${user.name} • ${user.role === 'worker' ? t('profilePage.roleWorker') : t('profilePage.roleEmployer')}`}
        />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('profilePage.statsSection')}</Text>
            <View style={styles.statsRow}>
              {stats.map((item) => (
                <View key={item.key} style={styles.statItem}>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('profilePage.editProfileTitle')}</Text>
            <Input
              label={t('profilePage.headline')}
              placeholder={t('jobs.positionPlaceholder')}
              value={headline}
              onChangeText={setHeadline}
            />
            <Input
              label={t('profilePage.about')}
              placeholder={t('jobs.aboutPlaceholder')}
              value={about}
              onChangeText={setAbout}
              multiline
              numberOfLines={4}
            />
            <Input
              label={t('profilePage.skills')}
              placeholder={t('jobs.skillsPlaceholder')}
              value={skills}
              onChangeText={setSkills}
            />
            <Input
              label={t('profilePage.experience')}
              placeholder={t('jobs.experiencePlaceholder')}
              value={experience}
              onChangeText={setExperience}
              multiline
              numberOfLines={4}
            />
            <Button title={t('profilePage.saveProfile')} onPress={saveProfile} fullWidth />
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('profilePage.quickActions')}</Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={styles.quickAction} onPress={() => router.replace('/favorites')}>
                <Text style={styles.quickActionText}>{t('profilePage.goFavorites')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => router.replace('/messages')}>
                <Text style={styles.quickActionText}>{t('profilePage.goMessages')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => router.replace('/settings')}>
                <Text style={styles.quickActionText}>{t('profilePage.goSettings')}</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('profilePage.preferencesTitle')}</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.notificationsTitle')}</Text>
              </View>
              <Switch
                value={preferences.notificationsEnabled}
                onValueChange={(value) => setPreference('notificationsEnabled', value)}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.openToWorkTitle')}</Text>
              </View>
              <Switch
                value={preferences.openToWork}
                onValueChange={(value) => setPreference('openToWork', value)}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.compactModeTitle')}</Text>
              </View>
              <Switch
                value={preferences.compactMode}
                onValueChange={(value) => setPreference('compactMode', value)}
              />
            </View>
          </Card>

          <View style={styles.logoutWrap}>
            <Button title={t('auth.logout')} onPress={handleLogout} variant="outline" fullWidth />
          </View>
        </ScrollView>
      </View>

      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl + 96,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  quickActionsRow: {
    gap: spacing.sm,
  },
  quickAction: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  quickActionText: {
    fontSize: typography.sm,
    color: colors.text,
    fontWeight: typography.semibold,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingText: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.base,
    color: colors.text,
  },
  logoutWrap: {
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
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
