import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing, typography } from '@/constants/theme';
import type { UserRole } from '@/types/user';

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

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    
    onComplete({
      headline: headline.trim() || undefined,
      about: about.trim() || undefined,
      skills: skills.length ? skills : undefined,
      experience: experience.trim() || undefined,
      photo: undefined,
    });
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Додавання фото',
      'Ця функція буде доступна скоро!\nПоки що пропустіть цей крок.',
      [{ text: 'OK' }]
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Ionicons name="person-outline" size={32} color={colors.primary} />
              <Text style={styles.stepTitle}>Розкажіть про себе</Text>
              <Text style={styles.stepSubtitle}>Як вас звати і чим ви займаєтесь?</Text>
            </View>
            
            <Input
              label={userRole === 'worker' ? "Бажана посада" : "Ваша посада"}
              placeholder={userRole === 'worker' ? "Наприклад: React Native Developer" : "Наприклад: CEO"}
              value={headline}
              onChangeText={setHeadline}
            />
            
            <Input
              label="Про себе"
              placeholder="Коротко опишіть себе та свої цілі"
              value={about}
              onChangeText={setAbout}
              multiline
              numberOfLines={4}
            />
          </View>
        );
        
      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Ionicons name="construct-outline" size={32} color={colors.primary} />
              <Text style={styles.stepTitle}>Ваші навички</Text>
              <Text style={styles.stepSubtitle}>Чим ви вмієте працювати?</Text>
            </View>
            
            <Input
              label="Навички"
              placeholder="React, TypeScript, Node.js..."
              value={skillsText}
              onChangeText={setSkillsText}
            />
            
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>💡 Вкажіть навички через кому</Text>
            </View>
          </View>
        );
        
      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Ionicons name="briefcase-outline" size={32} color={colors.primary} />
              <Text style={styles.stepTitle}>Досвід роботи</Text>
              <Text style={styles.stepSubtitle}>Розкажіть про свій досвід</Text>
            </View>
            
            <Input
              label="Досвід"
              placeholder="Опишіть ваш досвід, проєкти, досягнення"
              value={experience}
              onChangeText={setExperience}
              multiline
              numberOfLines={4}
            />
          </View>
        );
        
      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Ionicons name="camera-outline" size={32} color={colors.primary} />
              <Text style={styles.stepTitle}>Ваше фото</Text>
              <Text style={styles.stepSubtitle}>Додайте фото для кращого враження</Text>
            </View>
            
            <TouchableOpacity style={styles.photoUpload} onPress={handlePhotoUpload}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={48} color={colors.textSecondary} />
                <Text style={styles.photoText}>Додати фото</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>💡 Фото допоможе роботодавцям краще пізнати вас</Text>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((item) => (
            <View
              key={item}
              style={[
                styles.progressDot,
                item <= step && styles.progressDotActive
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>Крок {step} з 4</Text>
      </View>

      {renderStepContent()}

      <View style={styles.actions}>
        <View style={styles.actionButtons}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePrevious}
            >
              <Text style={styles.backButtonText}>Назад</Text>
            </TouchableOpacity>
          )}
          
          <Button
            title={step === 4 ? 'Завершити' : 'Далі'}
            onPress={handleNext}
            fullWidth
          />
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>Пропустити налаштування</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tipBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  tipText: {
    fontSize: typography.sm,
    color: colors.primary,
  },
  photoUpload: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: typography.base,
    color: colors.text,
    fontWeight: typography.medium,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipButtonText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
