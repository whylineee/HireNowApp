import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { View } from 'react-native';
import EmployerHome from './components/EmployerHome';
import OnboardingScreen from './components/OnboardingScreen';
import RegistrationScreen from './components/RegistrationScreen';
import WorkerHome from './components/WorkerHome';

export default function HomeScreen() {
  const { user, register, updateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<'search' | 'profile'>('search');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newUser, setNewUser] = useState<any>(null);

  const handleRegistration = (userData: any) => {
    register(userData);
    setNewUser(userData);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (profileData: any) => {
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
          title={currentTab === 'profile' ? 'Моє резюме' : 'HireNow'}
          subtitle={currentTab === 'profile' ? '' : `Привіт, ${user.name}!`}
          showFavoritesButton={user.role === 'worker' && currentTab !== 'profile'}
          showSettingsButton={currentTab !== 'profile'}
        />
        
        {user.role === 'employer' ? (
          <EmployerHome />
        ) : (
          <WorkerHome userName={user.name} onUpdateProfile={updateUser} onTabChange={setCurrentTab} />
        )}
      </View>
      <BottomNav />
    </Screen>
  );
}
