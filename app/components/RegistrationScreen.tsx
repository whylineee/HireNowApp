import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import type { UserRole } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native';

interface RegistrationScreenProps {
  onRegister: (params: { name: string; role: UserRole }) => void;
}

export function RegistrationScreen({ onRegister }: RegistrationScreenProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('worker');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleSwitchWidth, setRoleSwitchWidth] = useState(0);

  const heroAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(0)).current;
  const roleAnim = useRef(new Animated.Value(selectedRole === 'worker' ? 0 : 1)).current;
  const agreeAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [badgePulse, cardAnim, heroAnim]);

  useEffect(() => {
    Animated.timing(roleAnim, {
      toValue: selectedRole === 'worker' ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [roleAnim, selectedRole]);

  useEffect(() => {
    Animated.spring(agreeAnim, {
      toValue: agreeToTerms ? 1 : 0,
      friction: 6,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [agreeAnim, agreeToTerms]);

  useEffect(() => {
    if (!error) {
      return;
    }

    Animated.sequence([
      Animated.timing(errorShake, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 1, duration: 40, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  }, [error, errorShake]);

  const heroOpacity = heroAnim;
  const heroTranslateY = heroAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const cardOpacity = cardAnim;
  const cardTranslateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
  const cardScale = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.985, 1] });
  const badgeScale = badgePulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
  const badgeOpacity = badgePulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });
  const rolePillWidth = roleSwitchWidth > 0 ? (roleSwitchWidth - spacing.sm - 4) / 2 : 0;
  const rolePillTranslateX = roleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, roleSwitchWidth > 0 ? 2 + rolePillWidth + spacing.sm : 2],
  });
  const checkboxScale = agreeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const errorTranslateX = errorShake.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -4, 4, -2, 0],
  });

  const setFormError = (message: string) => {
    setError(message);
  };

  const handleRoleSwitchLayout = (event: LayoutChangeEvent) => {
    setRoleSwitchWidth(event.nativeEvent.layout.width);
  };

  const clearError = () => {
    if (error) {
      setError(null);
    }
  };

  const validateBeforeAuth = () => {
    if (!agreeToTerms) {
      setFormError(t('registration.acceptTermsError'));
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!email.trim() || !phone.trim() || !password.trim()) {
      setFormError(t('registration.fillAllFieldsError'));
      return;
    }

    if (!validateBeforeAuth()) {
      return;
    }

    const name = email.split('@')[0] || email;
    onRegister({ name: name.trim(), role: selectedRole });
  };

  const handleGoogleAuth = () => {
    if (!validateBeforeAuth()) {
      return;
    }

    const fallbackName = `google_${String(Date.now()).slice(-4)}`;
    const baseName = email.includes('@') ? email.split('@')[0] : fallbackName;
    onRegister({ name: baseName.trim(), role: selectedRole });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View pointerEvents="none" style={styles.localBackdrop}>
        <View style={styles.glowTopRight} />
        <View style={styles.glowLeft} />
        <View style={styles.glowBottom} />
      </View>

      <Animated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] }]}>
        <Animated.View style={[styles.badge, { transform: [{ scale: badgeScale }], opacity: badgeOpacity }]}>
          <Ionicons name="sparkles-outline" size={14} color={colors.primary} />
          <Text style={styles.badgeText}>{t('registration.badge')}</Text>
        </Animated.View>

        <Text style={styles.title}>{t('registration.title')}</Text>
        <Text style={styles.subtitle}>{t('registration.subtitle')}</Text>
      </Animated.View>

      <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardTranslateY }, { scale: cardScale }] }}>
        <Card style={styles.formCard}>
          <Text style={styles.roleTitle}>{t('registration.roleTitle')}</Text>
          <View style={styles.rolesRow} onLayout={handleRoleSwitchLayout}>
            {rolePillWidth > 0 ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.roleChipPill,
                  {
                    width: rolePillWidth,
                    transform: [{ translateX: rolePillTranslateX }],
                  },
                ]}
              />
            ) : null}

            <TouchableOpacity
              style={[styles.roleChip, selectedRole === 'worker' && styles.roleChipActive]}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedRole('worker');
                clearError();
              }}
            >
              <Ionicons
                name="person-outline"
                size={16}
                color={selectedRole === 'worker' ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.roleChipText, selectedRole === 'worker' && styles.roleChipTextActive]}>
                {t('auth.iAmJobSeeker')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleChip, selectedRole === 'employer' && styles.roleChipActive]}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedRole('employer');
                clearError();
              }}
            >
              <Ionicons
                name="briefcase-outline"
                size={16}
                color={selectedRole === 'employer' ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.roleChipText, selectedRole === 'employer' && styles.roleChipTextActive]}>
                {t('auth.iAmEmployer')}
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            label={t('registration.email')}
            placeholder={t('registration.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError();
            }}
          />

          <Input
            label={t('registration.phone')}
            placeholder={t('registration.phonePlaceholder')}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              clearError();
            }}
          />

          <View style={styles.passwordWrapper}>
            <Input
              label={t('registration.password')}
              placeholder={t('registration.passwordPlaceholder')}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError();
              }}
              containerStyle={styles.passwordInputContainer}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <Animated.Text style={[styles.errorText, { transform: [{ translateX: errorTranslateX }] }]}>
              {error}
            </Animated.Text>
          ) : null}

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreeToTerms((prev) => !prev)} activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.checkbox,
                agreeToTerms && styles.checkboxActive,
                {
                  transform: [{ scale: checkboxScale }],
                },
              ]}
            >
              {agreeToTerms ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
            </Animated.View>
            <Text style={styles.termsText}>
              {t('registration.termsPrefix')} <Text style={styles.termsLink}>{t('registration.termsLink')}</Text>
            </Text>
          </TouchableOpacity>

          <Button title={t('registration.createAccount')} onPress={handleSubmit} fullWidth />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{t('common.or')}</Text>
            <View style={styles.divider} />
          </View>

          <Button title={t('registration.continueGoogle')} onPress={handleGoogleAuth} variant="outline" fullWidth />
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxl,
      position: 'relative',
    },
    localBackdrop: {
      ...StyleSheet.absoluteFillObject,
      top: -20,
    },
    glowTopRight: {
      position: 'absolute',
      top: -130,
      right: -80,
      width: 280,
      height: 280,
      borderRadius: 999,
      backgroundColor: isDark ? 'rgba(96,165,250,0.24)' : 'rgba(96,165,250,0.14)',
    },
    glowLeft: {
      position: 'absolute',
      top: 120,
      left: -130,
      width: 250,
      height: 250,
      borderRadius: 999,
      backgroundColor: isDark ? 'rgba(167,139,250,0.18)' : 'rgba(167,139,250,0.1)',
    },
    glowBottom: {
      position: 'absolute',
      top: 500,
      right: -110,
      width: 240,
      height: 240,
      borderRadius: 999,
      backgroundColor: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.07)',
    },
    hero: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 3,
      borderRadius: 16,
      backgroundColor: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(219,234,254,0.9)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(96,165,250,0.4)' : 'rgba(59,130,246,0.2)',
      marginBottom: spacing.md,
    },
    badgeText: {
      fontSize: typography.xs,
      color: colors.primary,
      fontWeight: typography.semibold,
    },
    title: {
      fontSize: 36,
      lineHeight: 40,
      letterSpacing: -1,
      fontWeight: typography.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    formCard: {
      borderRadius: 28,
      padding: spacing.md,
      backgroundColor: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.93)',
      borderColor: isDark ? 'rgba(148,163,184,0.3)' : 'rgba(148,163,184,0.2)',
      ...colors.shadow.md,
    },
    roleTitle: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      fontWeight: typography.medium,
    },
    rolesRow: {
      flexDirection: 'row',
      position: 'relative',
      gap: spacing.sm,
      marginBottom: spacing.md,
      borderRadius: 16,
      padding: 2,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isDark ? 'rgba(15,23,42,0.64)' : 'rgba(248,250,252,0.8)',
    },
    roleChipPill: {
      position: 'absolute',
      left: 0,
      top: 2,
      bottom: 2,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(147,197,253,0.65)' : 'rgba(37,99,235,0.25)',
      backgroundColor: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(239,246,255,0.95)',
    },
    roleChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 14,
      paddingVertical: spacing.sm,
      backgroundColor: 'transparent',
    },
    roleChipActive: {
      borderColor: 'transparent',
    },
    roleChipText: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      fontWeight: typography.medium,
      textAlign: 'center',
    },
    roleChipTextActive: {
      color: colors.primary,
    },
    passwordWrapper: {
      position: 'relative',
    },
    passwordInputContainer: {
      marginBottom: spacing.md,
    },
    eyeIcon: {
      position: 'absolute',
      right: spacing.md,
      top: 36,
    },
    errorText: {
      fontSize: typography.sm,
      color: colors.error,
      marginBottom: spacing.sm,
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm,
      backgroundColor: colors.surface,
    },
    checkboxActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    termsText: {
      flex: 1,
      fontSize: typography.sm,
      color: colors.textSecondary,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: typography.semibold,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.md,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: spacing.sm,
      fontSize: typography.xs,
      color: colors.textMuted,
      fontWeight: typography.medium,
    },
  });

export default RegistrationScreen;
