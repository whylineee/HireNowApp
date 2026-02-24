import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { useTranslation, type Language } from '@/hooks/useTranslation';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { themeMode, setThemeMode, colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
        <Header title={t('settings.title')} showBackButton showSettingsButton={false} />

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity style={[styles.option, language === 'uk' && styles.optionActive]} onPress={() => handleLanguageChange('uk')}>
                <Text style={[styles.optionText, language === 'uk' && styles.optionTextActive]}>{t('settings.ukrainian')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.option, language === 'en' && styles.optionActive]} onPress={() => handleLanguageChange('en')}>
                <Text style={[styles.optionText, language === 'en' && styles.optionTextActive]}>{t('settings.english')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity style={[styles.option, themeMode === 'light' && styles.optionActive]} onPress={() => handleThemeChange('light')}>
                <Text style={[styles.optionText, themeMode === 'light' && styles.optionTextActive]}>{t('settings.lightTheme')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.option, themeMode === 'dark' && styles.optionActive]} onPress={() => handleThemeChange('dark')}>
                <Text style={[styles.optionText, themeMode === 'dark' && styles.optionTextActive]}>{t('settings.darkTheme')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.option, themeMode === 'system' && styles.optionActive]} onPress={() => handleThemeChange('system')}>
                <Text style={[styles.optionText, themeMode === 'system' && styles.optionTextActive]}>{t('settings.systemTheme')}</Text>
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
        </ScrollView>
      </View>
      <BottomNav />
    </Screen>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: spacing.md,
    },
    contentContainer: {
      paddingBottom: spacing.xxl + 96,
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
      backgroundColor: colors.surfaceElevated,
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
      backgroundColor: isDark ? 'rgba(96,165,250,0.22)' : 'rgba(37,99,235,0.08)',
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
