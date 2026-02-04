import { Button } from '@/components/ui/Button';
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
    // Extract name from email for now
    const name = email.split('@')[0];
    onRegister({ name: name.trim(), role: 'worker' });
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to us,</Text>
          <Text style={styles.welcomeSubtitle}>Hello there, create New account</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.phoneIllustration}>
            <View style={styles.phoneFrame}>
              <View style={styles.phoneScreen}>
                <View style={styles.userCircle}>
                  <Ionicons name="person" size={40} color={colors.primary} />
                </View>
              </View>
            </View>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
            <View style={[styles.circle, styles.circle4]} />
          </View>
        </View>

        <View style={styles.formSection}>
          <Input
            placeholder="capicreativedesign"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            placeholder="(+84) 332249402"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (error) setError(null);
            }}
            containerStyle={styles.inputContainer}
          />
          
          <View style={styles.passwordContainer}>
            <Input
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
              secureTextEntry={!showPassword}
              containerStyle={styles.passwordInput}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkboxInner, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              By creating an account your aggree to our{' '}
              <Text style={styles.termsLink}>Term and Condtions</Text>
            </Text>
          </View>

          <Button
            title="Sign up"
            onPress={handleSubmit}
            fullWidth
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  backButton: {
    marginRight: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  phoneIllustration: {
    position: 'relative',
    width: 120,
    height: 200,
  },
  phoneFrame: {
    position: 'absolute',
    width: 80,
    height: 160,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    left: 20,
    top: 20,
  },
  phoneScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 4,
  },
  userCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 20,
  },
  circle1: {
    width: 20,
    height: 20,
    backgroundColor: '#FF6B6B',
    top: 10,
    left: 10,
  },
  circle2: {
    width: 15,
    height: 15,
    backgroundColor: '#4ECDC4',
    top: 30,
    right: 15,
  },
  circle3: {
    width: 25,
    height: 25,
    backgroundColor: '#45B7D1',
    bottom: 40,
    left: 5,
  },
  circle4: {
    width: 18,
    height: 18,
    backgroundColor: '#96CEB4',
    bottom: 20,
    right: 10,
  },
  formSection: {
    gap: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    fontSize: typography.sm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  checkbox: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  signupButton: {
    marginBottom: spacing.lg,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: typography.base,
    color: colors.primary,
    fontWeight: typography.semibold,
  },
});

export default RegistrationScreen;
