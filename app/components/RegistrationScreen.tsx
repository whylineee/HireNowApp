import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import type { UserRole } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RegistrationScreenProps {
  onRegister: (params: { name: string; role: UserRole }) => void;
}

export function RegistrationScreen({ onRegister }: RegistrationScreenProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!email.trim() || !phone.trim() || !password.trim()) {
      setError('Заповніть всі поля');
      return;
    }
    if (!agreeToTerms) {
      setError('Погодьтеся з умовами використання');
      return;
    }

    const name = email.split('@')[0];
    onRegister({ name: name.trim(), role: 'worker' });
  };

  const handleGoogleAuth = () => {
    Alert.alert('Google Sign In', t('registration.googleSoon'), [{ text: 'OK' }]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Ionicons name="sparkles-outline" size={14} color={colors.primary} />
          <Text style={styles.badgeText}>{t('registration.badge')}</Text>
        </View>

        <Text style={styles.title}>{t('registration.title')}</Text>
        <Text style={styles.subtitle}>{t('registration.subtitle')}</Text>
      </View>

      <Card style={styles.formCard}>
        <Input
          label={t('registration.email')}
          placeholder={t('registration.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
        />

        <Input
          label={t('registration.phone')}
          placeholder={t('registration.phonePlaceholder')}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (error) setError(null);
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
              if (error) setError(null);
            }}
            containerStyle={styles.passwordInputContainer}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreeToTerms((prev) => !prev)} activeOpacity={0.8}>
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxActive]}>
            {agreeToTerms ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
          </View>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
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
    backgroundColor: 'rgba(219,234,254,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
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
    backgroundColor: 'rgba(255,255,255,0.95)',
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
