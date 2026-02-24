import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header
          title={t('profilePage.title')}
          subtitle={user ? `${user.name} • ${user.role === 'worker' ? t('profilePage.roleWorker') : t('profilePage.roleEmployer')}` : undefined}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('profilePage.profileTitle')}</Text>
            <Text style={styles.cardText}>
              {t('profilePage.profileDesc')}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('profilePage.appSettingsTitle')}</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.darkThemeTitle')}</Text>
                <Text style={styles.settingSubtitle}>{t('profilePage.darkThemeSubtitle')}</Text>
              </View>
              <Switch value disabled />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profilePage.notificationsTitle')}</Text>
                <Text style={styles.settingSubtitle}>{t('profilePage.notificationsSubtitle')}</Text>
              </View>
              <Switch value disabled />
            </View>
          </Card>
        </ScrollView>
      </View>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  card: {
    padding: spacing.md + 2,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingText: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.base,
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});
