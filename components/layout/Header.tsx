import { colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showFavoritesButton?: boolean;
  showSettingsButton?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backLabel?: string;
}

export function Header({
  title,
  subtitle,
  showFavoritesButton,
  showSettingsButton,
  showBackButton,
  onBackPress,
  backLabel,
}: HeaderProps) {
  const { t } = useTranslation();

  const handleBack = () => {
    Haptics.selectionAsync().catch(() => undefined);
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  const handleOpenFavorites = () => {
    Haptics.selectionAsync().catch(() => undefined);
    router.push('/favorites');
  };

  const handleOpenProfile = () => {
    Haptics.selectionAsync().catch(() => undefined);
    router.push('/profile');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        {showBackButton && (
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
            <Text style={styles.backLabel}>{backLabel ?? t('common.back')}</Text>
          </Pressable>
        )}
        <View style={[styles.titleContainer, showBackButton && styles.titleContainerWithBack]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.actions}>
          {showFavoritesButton && (
            <Pressable
              onPress={handleOpenFavorites}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <Ionicons name="heart" size={20} color={colors.primary} />
            </Pressable>
          )}
          {showSettingsButton && (
            <Pressable
              onPress={handleOpenProfile}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  titleContainerWithBack: {
    marginLeft: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow.sm,
  },
  backLabel: {
    fontSize: typography.sm,
    color: colors.text,
    fontWeight: typography.semibold,
  },
  title: {
    fontSize: 24,
    fontWeight: typography.bold,
    color: colors.text,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.sm,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.sm,
    ...colors.shadow.sm,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
