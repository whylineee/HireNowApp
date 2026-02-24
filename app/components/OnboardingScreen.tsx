import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import type { UserRole } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OnboardingScreenProps {
  userRole: UserRole;
  userName: string;
  onComplete: (profileData: {
    headline?: string;
    about?: string;
    skills?: string[];
    experience?: string;
    photo?: string;
  }) => void;
  onSkip: () => void;
}

export function OnboardingScreen({ userRole, userName, onComplete, onSkip }: OnboardingScreenProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [experience, setExperience] = useState('');

  const handleComplete = () => {
    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onComplete({
      headline: headline.trim() || undefined,
      about: about.trim() || undefined,
      skills: skills.length ? skills : undefined,
      experience: experience.trim() || undefined,
      photo: undefined,
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }
    handleComplete();
  };

  const handlePhotoUpload = () => {
    Alert.alert(t('onboarding.profilePhoto'), t('onboarding.photoSoon'), [{ text: 'OK' }]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.greeting}>{t('onboarding.welcome', { name: userName })}</Text>
        <Text style={styles.title}>{t('onboarding.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.step', { step })}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${step * 25}%` }]} />
      </View>

      <Card style={styles.stepCard}>
        {step === 1 ? (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="person-outline" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>{t('onboarding.basicInfo')}</Text>
            </View>

            <Input
              label={userRole === 'worker' ? t('onboarding.desiredRole') : t('onboarding.yourRole')}
              placeholder={userRole === 'worker' ? t('onboarding.desiredRolePlaceholder') : t('onboarding.yourRolePlaceholder')}
              value={headline}
              onChangeText={setHeadline}
            />
            <Input
              label={t('onboarding.about')}
              placeholder={t('onboarding.aboutPlaceholder')}
              value={about}
              onChangeText={setAbout}
              multiline
              numberOfLines={4}
            />
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="sparkles-outline" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>{t('onboarding.skills')}</Text>
            </View>
            <Input
              label={t('onboarding.skills')}
              placeholder={t('onboarding.skillsPlaceholder')}
              value={skillsText}
              onChangeText={setSkillsText}
            />
            <Text style={styles.tipText}>{t('onboarding.skillsHint')}</Text>
          </View>
        ) : null}

        {step === 3 ? (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="briefcase-outline" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>{t('onboarding.experience')}</Text>
            </View>
            <Input
              label={t('onboarding.experience')}
              placeholder={t('onboarding.experiencePlaceholder')}
              value={experience}
              onChangeText={setExperience}
              multiline
              numberOfLines={4}
            />
          </View>
        ) : null}

        {step === 4 ? (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="camera-outline" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>{t('onboarding.profilePhoto')}</Text>
            </View>
            <TouchableOpacity style={styles.photoUpload} onPress={handlePhotoUpload}>
              <Ionicons name="camera" size={32} color={colors.textSecondary} />
              <Text style={styles.photoText}>{t('onboarding.addPhoto')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </Card>

      <View style={styles.actionsRow}>
        {step > 1 ? (
          <Button title={t('onboarding.back')} onPress={() => setStep((prev) => prev - 1)} variant="outline" />
        ) : null}
        <View style={styles.nextButtonWrap}>
          <Button title={step === 4 ? t('onboarding.finish') : t('common.next')} onPress={handleNext} fullWidth />
        </View>
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: {
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.8,
    fontWeight: typography.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.18)',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  stepCard: {
    borderRadius: 28,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stepTitle: {
    fontSize: typography.base,
    color: colors.text,
    fontWeight: typography.bold,
  },
  tipText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  photoUpload: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  photoText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  nextButtonWrap: {
    flex: 1,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  skipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
});

export default OnboardingScreen;
