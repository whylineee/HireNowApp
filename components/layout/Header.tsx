import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showFavoritesButton?: boolean;
}

export function Header({ title, subtitle, showFavoritesButton }: HeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {showFavoritesButton && (
          <TouchableOpacity
            onPress={() => router.push('/favorites')}
            style={styles.favoritesButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="heart" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
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
  favoritesButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
