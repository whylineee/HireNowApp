import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { spacing, typography } from '@/constants/theme';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const { favorites, clearFavorites } = useFavorites();
  const { applications, clearApplications } = useApplications();
  const { recentSearches, clearSearches } = useRecentSearches();
  const { preferences, setPreference } = useUserPreferences();
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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

  const completion = useMemo(() => {
    const fields = [headline.trim(), about.trim(), skills.trim(), experience.trim(), user?.photoUri ?? ''];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [about, experience, headline, skills, user?.photoUri]);

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

  const confirmClear = (title: string, action: () => void) => {
    Alert.alert(title, t('profilePage.clearDataConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.clear'),
        style: 'destructive',
        onPress: () => {
          action();
          Alert.alert(t('common.done'), t('profilePage.clearDataDone'));
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

  const avatarIcon = user.photoUri?.startsWith('avatar:') ? user.photoUri.replace('avatar:', '') : 'person';

  return (
    <Screen scroll={false}>
      <View style={styles.page}>
        <Header
          title={t('profilePage.title')}
          subtitle={`${user.name} • ${user.role === 'worker' ? t('profilePage.roleWorker') : t('profilePage.roleEmployer')}`}
        />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <Ionicons name={(avatarIcon + '-outline') as keyof typeof Ionicons.glyphMap} size={26} color={colors.primary} />
              </View>
              <View style={styles.profileTopText}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileRole}>{user.role === 'worker' ? t('profilePage.roleWorker') : t('profilePage.roleEmployer')}</Text>
              </View>
            </View>

            <View style={styles.progressWrap}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>{t('profilePage.profileCompletion')}</Text>
                <Text style={styles.progressValue}>{completion}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${completion}%` }]} />
              </View>
            </View>
          </Card>

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
              <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/favorites')}>
                <Text style={styles.quickActionText}>{t('profilePage.goFavorites')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/messages')}>
                <Text style={styles.quickActionText}>{t('profilePage.goMessages')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/settings')}>
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
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={preferences.notificationsEnabled ? colors.primary : colors.surface}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.openToWorkTitle')}</Text>
              </View>
              <Switch
                value={preferences.openToWork}
                onValueChange={(value) => setPreference('openToWork', value)}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={preferences.openToWork ? colors.primary : colors.surface}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.compactModeTitle')}</Text>
              </View>
              <Switch
                value={preferences.compactMode}
                onValueChange={(value) => setPreference('compactMode', value)}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={preferences.compactMode ? colors.primary : colors.surface}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.remoteOnlySearchTitle')}</Text>
              </View>
              <Switch
                value={preferences.remoteOnlySearch}
                onValueChange={(value) => setPreference('remoteOnlySearch', value)}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={preferences.remoteOnlySearch ? colors.primary : colors.surface}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.hideAppliedJobsTitle')}</Text>
              </View>
              <Switch
                value={preferences.hideAppliedJobs}
                onValueChange={(value) => setPreference('hideAppliedJobs', value)}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={preferences.hideAppliedJobs ? colors.primary : colors.surface}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.pinImportantChatsTitle')}</Text>
              </View>
              <Switch
                value={preferences.pinImportantChats}
                onValueChange={(value) => setPreference('pinImportantChats', value)}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={preferences.pinImportantChats ? colors.primary : colors.surface}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('profilePage.manageDataTitle')}</Text>
            <View style={styles.quickActionsRow}>
              <Button title={t('profilePage.clearFavorites')} variant="outline" onPress={() => confirmClear(t('profilePage.clearFavorites'), clearFavorites)} fullWidth />
              <Button
                title={t('profilePage.clearApplications')}
                variant="outline"
                onPress={() => confirmClear(t('profilePage.clearApplications'), clearApplications)}
                fullWidth
              />
              <Button title={t('profilePage.clearSearches')} variant="outline" onPress={() => confirmClear(t('profilePage.clearSearches'), clearSearches)} fullWidth />
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
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
    profileTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileTopText: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(219,234,254,0.9)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(96,165,250,0.4)' : 'rgba(59,130,246,0.2)',
    },
    profileName: {
      fontSize: typography.base,
      fontWeight: typography.bold,
      color: colors.text,
    },
    profileRole: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs / 2,
    },
    progressWrap: {
      marginTop: spacing.md,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    progressLabel: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      fontWeight: typography.medium,
    },
    progressValue: {
      fontSize: typography.sm,
      color: colors.primary,
      fontWeight: typography.semibold,
    },
    progressTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor: isDark ? 'rgba(148,163,184,0.28)' : 'rgba(148,163,184,0.2)',
      overflow: 'hidden',
    },
    progressFill: {
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.primary,
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
      backgroundColor: colors.surface,
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
      backgroundColor: colors.surface,
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
