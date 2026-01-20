import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showFavoritesButton?: boolean;
  showSettingsButton?: boolean;
}

export function Header({ title, subtitle, showFavoritesButton, showSettingsButton }: HeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <View style={styles.titleContainer}>
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
    borderColor: colors.borderLight,
    marginLeft: spacing.sm,
    ...colors.shadow.sm,
  },
});
