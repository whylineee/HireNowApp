import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import type { UserRole } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RegistrationScreenProps {
  onRegister: (params: { name: string; role: UserRole }) => void;
}

export function RegistrationScreen({ onRegister }: RegistrationScreenProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(t('auth.nameRequired'));
      return;
    }
    onRegister({ name: name.trim(), role });
  };

  const handleGoogleAuth = () => {
    Alert.alert(
      'Реєстрація через Google',
      'Ця функція буде доступна скоро!\nПоки що використайте звичайну реєстрацію.',
      [{ text: 'OK' }]
    );
  };

  const handlePhoneAuth = () => {
    Alert.alert(
      'Реєстрація через телефон',
      'Ця функція буде доступна скоро!\nПоки що використайте звичайну реєстрацію.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>HireNow</Text>
          <Text style={styles.tagline}>Ваша кар&apos;єра починається тут</Text>
        </View>
      </View>

      <View style={styles.registrationCard}>
        <Text style={styles.title}>Створити акаунт</Text>
        <Text style={styles.subtitle}>Оберіть вашу роль та почніть шлях до успіху</Text>
        
        <View style={styles.roleSelection}>
          <Text style={styles.roleLabel}>Я ви?</Text>
          <View style={styles.roleCards}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'worker' && styles.roleCardActive]}
              onPress={() => setRole('worker')}
              activeOpacity={0.8}
            >
              <View style={styles.roleIcon}>
                <Ionicons name="person-outline" size={32} color={role === 'worker' ? colors.primary : colors.textSecondary} />
              </View>
              <Text style={[styles.roleTitle, role === 'worker' && styles.roleTitleActive]}>Шукач роботи</Text>
              <Text style={styles.roleDescription}>Знайдіть ідеальну роботу</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.roleCard, role === 'employer' && styles.roleCardActive]}
              onPress={() => setRole('employer')}
              activeOpacity={0.8}
            >
              <View style={styles.roleIcon}>
                <Ionicons name="business-outline" size={32} color={role === 'employer' ? colors.primary : colors.textSecondary} />
              </View>
              <Text style={[styles.roleTitle, role === 'employer' && styles.roleTitleActive]}>Роботодавець</Text>
              <Text style={styles.roleDescription}>Знайдіть талановитих людей</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Input
            label="Ваше ім'я"
            placeholder="Іван Петренко"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError(null);
            }}
            error={error ?? undefined}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.socialAuthSection}>
          <Text style={styles.dividerText}>Або увійдіть через</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleAuth}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color={colors.text} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handlePhoneAuth}
              activeOpacity={0.8}
            >
              <Ionicons name="phone-portrait-outline" size={20} color={colors.text} />
              <Text style={styles.socialButtonText}>Телефон</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Button
            title={role === 'worker' ? 'Почати пошук роботи' : 'Перейти до кабінету'}
            onPress={handleSubmit}
            fullWidth
          />
          <Text style={styles.termsText}>Реєструючись, ви погоджуєтесь з умовами використання</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: typography.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  registrationCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingTop: 48,
    ...colors.shadow.lg,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  roleSelection: {
    marginBottom: spacing.xl,
  },
  roleLabel: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  roleCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  roleIcon: {
    marginBottom: spacing.sm,
  },
  roleTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  roleTitleActive: {
    color: colors.primary,
  },
  roleDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  socialAuthSection: {
    marginBottom: spacing.xl,
  },
  dividerText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  socialButtonText: {
    fontSize: typography.base,
    color: colors.text,
    fontWeight: typography.medium,
  },
  actionSection: {
    gap: spacing.md,
  },
  termsText: {
    fontSize: typography.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default RegistrationScreen;
