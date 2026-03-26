import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { triggerSelectionHaptic } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppPath = '/' | '/favorites' | '/messages' | '/settings';

type NavTab = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: AppPath;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const [primaryPillWidth, setPrimaryPillWidth] = useState(0);

  const tabs: NavTab[] = [
    { key: 'home', label: t('navigation.home'), icon: 'home-outline' as const, href: '/' },
    { key: 'favorites', label: t('navigation.favorites'), icon: 'heart-outline' as const, href: '/favorites' },
    { key: 'messages', label: t('navigation.messages'), icon: 'chatbubble-outline' as const, href: '/messages' },
    { key: 'settings', label: t('navigation.settings'), icon: 'menu-outline' as const, href: '/settings' },
  ];

  const primaryTabs = tabs.slice(0, 2);
  const actionTabs = tabs.slice(2);
  const activePrimaryIndex = primaryTabs.findIndex((tab) => (tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)));
  const primarySlotWidth = primaryPillWidth > 0 ? (primaryPillWidth - spacing.xs * 2) / primaryTabs.length : 0;

  const isHomeActive = pathname === '/';
  const isFavoritesActive = pathname.startsWith('/favorites');
  const isMessagesActive = pathname.startsWith('/messages');
  const isSettingsActive = pathname.startsWith('/settings');

  const revealAnim = useRef(new Animated.Value(0)).current;
  const primaryIndicatorX = useRef(new Animated.Value(0)).current;
  const primaryIndicatorOpacity = useRef(new Animated.Value(activePrimaryIndex >= 0 ? 1 : 0)).current;
  const liquidMorph = useRef(new Animated.Value(0)).current;
  const homeState = useRef(new Animated.Value(isHomeActive ? 1 : 0)).current;
  const favoritesState = useRef(new Animated.Value(isFavoritesActive ? 1 : 0)).current;
  const messagesState = useRef(new Animated.Value(isMessagesActive ? 1 : 0)).current;
  const settingsState = useRef(new Animated.Value(isSettingsActive ? 1 : 0)).current;
  const indicatorOffsetRef = useRef(activePrimaryIndex > 0 ? activePrimaryIndex * primarySlotWidth : 0);
  const dragStartXRef = useRef(0);
  const dragIndexRef = useRef(activePrimaryIndex > 0 ? activePrimaryIndex : 0);
  const isDraggingRef = useRef(false);
  const pendingPrimaryIndexRef = useRef<number | null>(null);

  useEffect(() => {
    Animated.timing(revealAnim, {
      toValue: 1,
      duration: 90,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [revealAnim]);

  useEffect(() => {
    if (primarySlotWidth <= 0) return;
    if (isDraggingRef.current) return;

    if (activePrimaryIndex >= 0) {
      const targetX = activePrimaryIndex * primarySlotWidth;
      indicatorOffsetRef.current = targetX;
      dragIndexRef.current = activePrimaryIndex;

      if (pendingPrimaryIndexRef.current === activePrimaryIndex) {
        pendingPrimaryIndexRef.current = null;
        return;
      }

      Animated.parallel([
        Animated.spring(primaryIndicatorX, {
          toValue: targetX,
          damping: 20,
          stiffness: 360,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(primaryIndicatorOpacity, {
          toValue: 1,
          duration: 110,
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    Animated.timing(primaryIndicatorOpacity, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [activePrimaryIndex, liquidMorph, primaryIndicatorOpacity, primaryIndicatorX, primarySlotWidth]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(homeState, {
        toValue: isHomeActive ? 1 : 0,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(favoritesState, {
        toValue: isFavoritesActive ? 1 : 0,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(messagesState, {
        toValue: isMessagesActive ? 1 : 0,
        damping: 14,
        stiffness: 280,
        mass: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(settingsState, {
        toValue: isSettingsActive ? 1 : 0,
        damping: 14,
        stiffness: 280,
        mass: 0.9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [favoritesState, homeState, isFavoritesActive, isHomeActive, isMessagesActive, isSettingsActive, messagesState, settingsState]);

  const animatePrimaryPress = (targetIndex: 0 | 1) => {
    if (primarySlotWidth <= 0) return;
    pendingPrimaryIndexRef.current = targetIndex;
    const targetX = targetIndex * primarySlotWidth;
    indicatorOffsetRef.current = targetX;
    dragIndexRef.current = targetIndex;
    primaryIndicatorX.stopAnimation();
    liquidMorph.stopAnimation();

    Animated.parallel([
      Animated.spring(primaryIndicatorX, {
        toValue: targetX,
        damping: 16,
        stiffness: 420,
        mass: 0.82,
        useNativeDriver: true,
      }),
      Animated.timing(primaryIndicatorOpacity, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(liquidMorph, {
          toValue: 1,
          duration: 70,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(liquidMorph, {
          toValue: 0,
          duration: 90,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(homeState, {
        toValue: targetIndex === 0 ? 1 : 0,
        duration: 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(favoritesState, {
        toValue: targetIndex === 1 ? 1 : 0,
        duration: 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateActionPress = (target: 'messages' | 'settings') => {
    Animated.parallel([
      Animated.spring(messagesState, {
        toValue: target === 'messages' ? 1 : 0,
        damping: 12,
        stiffness: 340,
        mass: 0.82,
        useNativeDriver: true,
      }),
      Animated.spring(settingsState, {
        toValue: target === 'settings' ? 1 : 0,
        damping: 12,
        stiffness: 340,
        mass: 0.82,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateTo = (href: AppPath, isActive: boolean) => {
    if (isActive) return;
    router.navigate(href);
    requestAnimationFrame(() => {
      triggerSelectionHaptic();
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          primarySlotWidth > 0 && Math.abs(gestureState.dx) > 5 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderGrant: () => {
          if (primarySlotWidth <= 0) return;
          isDraggingRef.current = true;
          primaryIndicatorX.stopAnimation((value) => {
            indicatorOffsetRef.current = value;
            dragStartXRef.current = value;
          });
          primaryIndicatorOpacity.setValue(1);
        },
        onPanResponderMove: (_, gestureState) => {
          if (primarySlotWidth <= 0) return;
          const maxX = primarySlotWidth;
          const nextX = clamp(dragStartXRef.current + gestureState.dx, 0, maxX);
          const progress = maxX > 0 ? nextX / maxX : 0;

          primaryIndicatorX.setValue(nextX);
          homeState.setValue(1 - progress);
          favoritesState.setValue(progress);
          liquidMorph.setValue(Math.min(1, Math.abs(gestureState.vx) * 0.6 + Math.abs(progress - 0.5)));
          dragIndexRef.current = progress >= 0.5 ? 1 : 0;
        },
        onPanResponderRelease: () => {
          if (primarySlotWidth <= 0) return;
          const targetIndex = dragIndexRef.current;
          pendingPrimaryIndexRef.current = targetIndex;
          const targetX = targetIndex * primarySlotWidth;
          isDraggingRef.current = false;

          Animated.parallel([
            Animated.spring(primaryIndicatorX, {
              toValue: targetX,
              damping: 18,
              stiffness: 380,
              mass: 0.85,
              useNativeDriver: true,
            }),
            Animated.timing(liquidMorph, {
              toValue: 0,
              duration: 120,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start();

          indicatorOffsetRef.current = targetX;
          const targetTab = primaryTabs[targetIndex];
          if (targetTab) {
            const targetActive = targetTab.href === '/' ? isHomeActive : isFavoritesActive;
            navigateTo(targetTab.href, targetActive);
          }
        },
        onPanResponderTerminate: () => {
          if (primarySlotWidth > 0) {
            const fallbackIndex = isFavoritesActive ? 1 : 0;
            const fallbackX = fallbackIndex * primarySlotWidth;
            Animated.spring(primaryIndicatorX, {
              toValue: fallbackX,
              damping: 18,
              stiffness: 380,
              mass: 0.85,
              useNativeDriver: true,
            }).start();
            homeState.setValue(fallbackIndex === 0 ? 1 : 0);
            favoritesState.setValue(fallbackIndex === 1 ? 1 : 0);
          }
          isDraggingRef.current = false;
          liquidMorph.setValue(0);
        },
      }),
    [favoritesState, homeState, isFavoritesActive, isHomeActive, liquidMorph, primaryIndicatorOpacity, primaryIndicatorX, primarySlotWidth, primaryTabs]
  );

  return (
    <View pointerEvents="box-none" style={[styles.container, { bottom: Math.max(insets.bottom, spacing.sm) }]}>
      <Animated.View
        style={[
          styles.navContent,
          {
            opacity: revealAnim,
            transform: [
              {
                translateY: revealAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={styles.primaryPill}
          onLayout={(event) => setPrimaryPillWidth(event.nativeEvent.layout.width)}
          {...panResponder.panHandlers}
        >
          <View pointerEvents="none" style={styles.primaryPillGlow} />
          <View pointerEvents="none" style={styles.primaryPillShine} />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.primaryIndicator,
              {
                width: Math.max(primarySlotWidth - 4, 0),
                opacity: primaryIndicatorOpacity,
                transform: [
                  { translateX: primaryIndicatorX },
                  {
                    scaleX: liquidMorph.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.12],
                    }),
                  },
                  {
                    scaleY: liquidMorph.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.94],
                    }),
                  },
                ],
              },
            ]}
          />

          {primaryTabs.map((tab) => {
            const isActive = tab.href === '/' ? isHomeActive : isFavoritesActive;
            const tabState = tab.key === 'home' ? homeState : favoritesState;

            return (
              <Pressable
                key={tab.key}
                style={({ pressed }) => [styles.primaryTab, pressed && styles.primaryPressed]}
                hitSlop={6}
                onPress={() => {
                  animatePrimaryPress(tab.key === 'home' ? 0 : 1);
                  navigateTo(tab.href, isActive);
                }}
              >
                <Animated.View
                  style={[
                    styles.primaryTabContent,
                    {
                      opacity: tabState.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.78, 1],
                      }),
                      transform: [
                        {
                          translateY: tabState.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0],
                          }),
                        },
                        {
                          scale: tabState.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.98, 1.02],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name={tab.icon} size={21} color={isActive ? colors.primaryDark : colors.text} />
                  <Text style={[styles.primaryLabel, isActive && styles.primaryLabelActive]} numberOfLines={1}>
                    {tab.label}
                  </Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>

        {actionTabs.map((tab) => {
          const isActive = tab.href === '/messages' ? isMessagesActive : isSettingsActive;
          const actionState = tab.href === '/messages' ? messagesState : settingsState;

          return (
            <Pressable
              key={tab.key}
              style={({ pressed }) => [styles.actionPressable, pressed && styles.pressed]}
              hitSlop={6}
              onPress={() => {
                animateActionPress(tab.href === '/messages' ? 'messages' : 'settings');
                navigateTo(tab.href, isActive);
              }}
            >
              <Animated.View
                style={[
                  styles.actionButton,
                  isActive && styles.actionButtonActive,
                  {
                    transform: [
                      {
                        translateY: actionState.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -5],
                        }),
                      },
                      {
                        scale: actionState.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.055],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View pointerEvents="none" style={styles.actionGlassGlow} />
                <View pointerEvents="none" style={styles.actionGlassShine} />
                <Ionicons name={tab.icon} size={26} color={isActive ? colors.primaryDark : colors.text} />
              </Animated.View>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: spacing.md,
      right: spacing.md,
    },
    navContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    primaryPill: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(10,18,34,0.74)' : 'rgba(248,249,252,0.74)',
      borderRadius: borderRadius.full,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(148,163,184,0.32)' : 'rgba(148,163,184,0.28)',
      overflow: 'hidden',
      ...colors.shadow.lg,
    },
    primaryPillGlow: {
      position: 'absolute',
      top: -24,
      left: -8,
      right: -8,
      height: 46,
      borderRadius: borderRadius.full,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.42)',
    },
    primaryPillShine: {
      position: 'absolute',
      top: 1,
      left: spacing.md,
      right: spacing.md,
      height: 1,
      backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.72)',
      opacity: 0.9,
    },
    primaryIndicator: {
      position: 'absolute',
      left: spacing.xs + 2,
      top: spacing.xs + 3,
      bottom: spacing.xs + 3,
      borderRadius: borderRadius.full,
      backgroundColor: isDark ? 'rgba(30,41,59,0.78)' : 'rgba(255,255,255,0.94)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(96,165,250,0.34)' : 'rgba(148,163,184,0.26)',
      ...colors.shadow.md,
    },
    primaryTab: {
      flex: 1,
      minWidth: 0,
      borderRadius: borderRadius.full,
    },
    primaryTabContent: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm + 2,
      gap: spacing.xs,
    },
    primaryLabel: {
      fontSize: typography.xs,
      color: isDark ? colors.textSecondary : '#2A2B2E',
      fontWeight: typography.semibold,
      textAlign: 'center',
    },
    primaryLabelActive: {
      color: colors.primaryDark,
    },
    actionPressable: {
      borderRadius: borderRadius.full,
    },
    actionButton: {
      width: 64,
      height: 64,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: isDark ? 'rgba(10,18,34,0.76)' : 'rgba(248,249,252,0.76)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(148,163,184,0.32)' : 'rgba(148,163,184,0.28)',
      ...colors.shadow.lg,
    },
    actionGlassGlow: {
      position: 'absolute',
      top: -20,
      left: -8,
      right: -8,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.42)',
    },
    actionGlassShine: {
      position: 'absolute',
      top: 2,
      left: 12,
      right: 12,
      height: 1,
      backgroundColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.72)',
      opacity: 0.86,
    },
    actionButtonActive: {
      borderColor: isDark ? 'rgba(96,165,250,0.48)' : 'rgba(37,99,235,0.34)',
    },
    pressed: {
      opacity: isDark ? 0.93 : 0.86,
      transform: [{ scale: 0.985 }],
    },
    primaryPressed: {
      opacity: isDark ? 0.96 : 0.9,
    },
  });
