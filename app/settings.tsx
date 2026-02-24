import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import type { ThemeMode } from '@/hooks/useTheme';
import { useTheme } from '@/hooks/useTheme';
import type { Language } from '@/hooks/useTranslation';
import { useTranslation } from '@/hooks/useTranslation';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { themeMode, setThemeMode } = useTheme();
  
  if (!user) {
    return (
      <Screen>
        <Card style={styles.authCard}>
          <Text style={styles.authText}>{t('common.authRequired')}</Text>
        </Card>
      </Screen>
    );
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header
          title={t('settings.title')}
          showSettingsButton={false}
        />

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[styles.option, language === 'uk' && styles.optionActive]}
                onPress={() => handleLanguageChange('uk')}
              >
                <Text style={[styles.optionText, language === 'uk' && styles.optionTextActive]}>
                  {t('settings.ukrainian')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, language === 'en' && styles.optionActive]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[styles.optionText, language === 'en' && styles.optionTextActive]}>
                  {t('settings.english')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[styles.option, themeMode === 'light' && styles.optionActive]}
                onPress={() => handleThemeChange('light')}
              >
                <Text style={[styles.optionText, themeMode === 'light' && styles.optionTextActive]}>
                  {t('settings.lightTheme')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, themeMode === 'dark' && styles.optionActive]}
                onPress={() => handleThemeChange('dark')}
              >
                <Text style={[styles.optionText, themeMode === 'dark' && styles.optionTextActive]}>
                  {t('settings.darkTheme')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, themeMode === 'system' && styles.optionActive]}
                onPress={() => handleThemeChange('system')}
              >
                <Text style={[styles.optionText, themeMode === 'system' && styles.optionTextActive]}>
                  {t('settings.systemTheme')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('settings.version')}</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionGroup: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow.sm,
  },
  option: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionActive: {
    backgroundColor: 'rgba(37,99,235,0.08)',
  },
  optionText: {
    fontSize: typography.sm,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.sm,
    color: colors.text,
    fontWeight: typography.medium,
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
