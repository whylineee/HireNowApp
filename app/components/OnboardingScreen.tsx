import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import type { UserRole } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    Alert.alert('Фото профілю', 'Додавання фото буде доступне в наступному оновленні.', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>Welcome, {userName}</Text>
        <Text style={styles.title}>Let's complete your profile</Text>
        <Text style={styles.subtitle}>Step {step} of 4</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${step * 25}%` }]} />
      </View>

      <Card style={styles.stepCard}>
        {step === 1 ? (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="person-outline" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>Basic info</Text>
            </View>

            <Input
              label={userRole === 'worker' ? 'Desired role' : 'Your role'}
              placeholder={userRole === 'worker' ? 'Frontend Engineer' : 'Engineering Manager'}
              value={headline}
              onChangeText={setHeadline}
            />
            <Input
              label="About"
              placeholder="Short summary about your goals and background"
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
              <Text style={styles.stepTitle}>Skills</Text>
            </View>
            <Input
              label="Skills"
              placeholder="React, TypeScript, Playwright..."
              value={skillsText}
              onChangeText={setSkillsText}
            />
            <Text style={styles.tipText}>Use comma-separated values</Text>
          </View>
        ) : null}

        {step === 3 ? (
          <View>
            <View style={styles.stepHeader}>
              <Ionicons name="briefcase-outline" size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>Experience</Text>
            </View>
            <Input
              label="Work experience"
              placeholder="Describe projects and achievements"
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
              <Text style={styles.stepTitle}>Profile photo</Text>
            </View>
            <TouchableOpacity style={styles.photoUpload} onPress={handlePhotoUpload}>
              <Ionicons name="camera" size={32} color={colors.textSecondary} />
              <Text style={styles.photoText}>Add photo</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </Card>

      <View style={styles.actionsRow}>
        {step > 1 ? (
          <Button title="Back" onPress={() => setStep((prev) => prev - 1)} variant="outline" />
        ) : null}
        <View style={styles.nextButtonWrap}>
          <Button title={step === 4 ? 'Finish' : 'Next'} onPress={handleNext} fullWidth />
        </View>
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>Skip setup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
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
    flex: 1,
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
