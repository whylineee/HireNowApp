import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppPath = '/' | '/favorites' | '/messages' | '/settings';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const tabs: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; href: AppPath }[] = [
    { key: 'home', label: t('navigation.home'), icon: 'home-outline' as const, href: '/' },
    { key: 'favorites', label: t('navigation.favorites'), icon: 'heart-outline' as const, href: '/favorites' },
    { key: 'messages', label: t('navigation.messages'), icon: 'chatbubble-outline' as const, href: '/messages' },
    { key: 'settings', label: t('navigation.settings'), icon: 'settings-outline' as const, href: '/settings' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navContent}>
        {tabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Pressable
              key={tab.key}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
              onPress={() => {
                if (!isActive) {
                  Haptics.selectionAsync().catch(() => undefined);
                  router.replace(tab.href);
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
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow.lg,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm + 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  iconWrapper: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 4,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(37,99,235,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  label: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  pressed: {
    opacity: 0.82,
  },
});
