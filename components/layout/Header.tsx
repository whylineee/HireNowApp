import { colors, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showFavoritesButton?: boolean;
  showSettingsButton?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function Header({ title, subtitle, showFavoritesButton, showSettingsButton, showBackButton, onBackPress }: HeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        {showBackButton && (
          <TouchableOpacity
            onPress={onBackPress || router.back}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        <View style={[styles.titleContainer, showBackButton && styles.titleContainerWithBack]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.actions}>
          {showFavoritesButton && (
            <TouchableOpacity
              onPress={() => router.push('/favorites')}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="heart" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {showSettingsButton && (
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
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
  title: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.sm,
    ...colors.shadow.sm,
  },
});
