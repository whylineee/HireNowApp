import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import type { UserRole } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OnboardingScreenProps {
  userRole: UserRole;
  userName: string;
  onComplete: (profileData: {
    headline?: string;
    about?: string;
    skills?: string[];
    experience?: string;
    photoUri?: string;
  }) => void;
  onSkip: () => void;
}

const AVATAR_OPTIONS: { key: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { key: 'person', icon: 'person-outline', color: '#2563EB' },
  { key: 'rocket', icon: 'rocket-outline', color: '#06B6D4' },
  { key: 'flash', icon: 'flash-outline', color: '#F59E0B' },
  { key: 'sparkles', icon: 'sparkles-outline', color: '#7C3AED' },
  { key: 'planet', icon: 'planet-outline', color: '#14B8A6' },
  { key: 'code', icon: 'code-slash-outline', color: '#EF4444' },
];

export function OnboardingScreen({ userRole, userName, onComplete, onSkip }: OnboardingScreenProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].key);

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
      photoUri: `avatar:${selectedAvatar}`,
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }
    handleComplete();
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

            <Text style={styles.tipText}>{t('onboarding.chooseAvatar')}</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = avatar.key === selectedAvatar;
                return (
                  <TouchableOpacity
                    key={avatar.key}
                    style={[styles.avatarOption, isSelected && styles.avatarOptionActive]}
                    onPress={() => setSelectedAvatar(avatar.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={avatar.icon} size={28} color={avatar.color} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}
      </Card>

      <View style={styles.actionsRow}>
        {step > 1 ? <Button title={t('onboarding.back')} onPress={() => setStep((prev) => prev - 1)} variant="outline" /> : null}
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
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  avatarOption: {
    width: 62,
    height: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionActive: {
    borderColor: 'rgba(37,99,235,0.45)',
    backgroundColor: 'rgba(37,99,235,0.1)',
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
