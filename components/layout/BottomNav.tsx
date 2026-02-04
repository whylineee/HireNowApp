import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Анімація при першому завантаженні
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const tabs = [
    { key: 'home', label: t('navigation.home'), icon: 'home-outline' as const, href: '/' },
    { key: 'favorites', label: t('navigation.favorites'), icon: 'heart-outline' as const, href: '/favorites' },
    { key: 'messages', label: t('navigation.messages'), icon: 'chatbubble-outline' as const, href: '/messages' },
    { key: 'settings', label: t('navigation.settings'), icon: 'settings-outline' as const, href: '/settings' },
  ] as const;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0]
            })},
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={styles.navContent}>
        {tabs.map((tab, index) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const tabScaleAnim = useRef(new Animated.Value(1)).current;
          
          const handleTabPress = () => {
            if (!isActive) {
              // Анімація натискання
              Animated.sequence([
                Animated.timing(tabScaleAnim, {
                  toValue: 0.9,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(tabScaleAnim, {
                  toValue: 1.1,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(tabScaleAnim, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                })
              ]).start(() => {
                const href = tab.href as any;
                router.push(href);
              });
            }
          };

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.8}
              onPress={handleTabPress}
            >
              <Animated.View 
                style={[
                  styles.iconWrapper,
                  isActive && styles.iconWrapperActive,
                  {
                    transform: [{ scale: tabScaleAnim }]
                  }
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
              </Animated.View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Прозорий білий
    backdropFilter: 'blur(20px)', // Ефект розмиття
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)', // Прозора рамка
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  iconWrapper: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    marginBottom: spacing.xs,
  },
  iconWrapperActive: {
    backgroundColor: colors.primary + '15',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
});

