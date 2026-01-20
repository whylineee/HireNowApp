import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

const TABS = [
  { key: 'home', label: 'Головна', icon: 'home-outline' as const, href: '/' },
  { key: 'favorites', label: 'Збережені', icon: 'heart-outline' as const, href: '/favorites' },
  { key: 'profile', label: 'Мій кабінет', icon: 'person-circle-outline' as const, href: '/profile' },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => {
              if (!isActive) router.push(tab.href);
            }}
          >
            <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
              <Ionicons
                name={tab.icon}
                size={20}
                color={isActive ? colors.primary : colors.textSecondary}
              />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    padding: spacing.xs,
    borderRadius: borderRadius.full,
  },
  iconWrapperActive: {
    backgroundColor: colors.surfaceHover,
  },
  label: {
    marginTop: 2,
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: typography.medium,
  },
});

