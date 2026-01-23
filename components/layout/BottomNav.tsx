import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const tabs = [
    { key: 'home', label: t('navigation.home'), icon: 'home-outline' as const, href: '/' },
    { key: 'favorites', label: t('navigation.favorites'), icon: 'heart-outline' as const, href: '/favorites' },
    { key: 'messages', label: t('navigation.messages'), icon: 'chatbubble-outline' as const, href: '/messages' },
    { key: 'settings', label: t('navigation.settings'), icon: 'settings-outline' as const, href: '/settings' },
  ] as const;

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => {
              if (!isActive) {
                const href = tab.href as any;
                router.push(href);
              }
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

