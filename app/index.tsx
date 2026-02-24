import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import type { User, UserRole } from '@/types/user';
import { useState } from 'react';
import { View } from 'react-native';
import EmployerHome from './components/EmployerHome';
import OnboardingScreen from './components/OnboardingScreen';
import RegistrationScreen from './components/RegistrationScreen';
import WorkerHome from './components/WorkerHome';

type RegistrationPayload = {
  name: string;
  role: UserRole;
};

type OnboardingPayload = Pick<User, 'headline' | 'about' | 'skills' | 'experience' | 'photoUri'>;

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user, register, updateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<'search' | 'profile'>('search');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newUser, setNewUser] = useState<RegistrationPayload | null>(null);

  const handleRegistration = (userData: RegistrationPayload) => {
    register(userData);
    setNewUser(userData);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (profileData: OnboardingPayload) => {
    updateUser(profileData);
    setShowOnboarding(false);
    setNewUser(null);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setNewUser(null);
  };

  if (!user || showOnboarding) {
    return (
      <Screen>
        {showOnboarding && newUser ? (
          <OnboardingScreen
            userRole={newUser.role}
            userName={newUser.name}
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        ) : (
          <RegistrationScreen onRegister={handleRegistration} />
        )}
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header
          title={currentTab === 'profile' ? t('jobs.myResume') : 'HireNow'}
          subtitle={currentTab === 'profile' ? '' : t('home.heroBadge')}
          showFavoritesButton={user.role === 'worker' && currentTab !== 'profile'}
          showSettingsButton={currentTab !== 'profile'}
        />
        
        {user.role === 'employer' ? (
          <EmployerHome />
        ) : (
          <WorkerHome
            userName={user.name}
            profile={{
              headline: user.headline,
              about: user.about,
              skills: user.skills,
              experience: user.experience,
              photoUri: user.photoUri,
            }}
            onUpdateProfile={updateUser}
            onTabChange={setCurrentTab}
          />
        )}
      </View>
      <BottomNav />
    </Screen>
  );
}
