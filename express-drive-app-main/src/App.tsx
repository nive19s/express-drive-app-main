import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DeliveryProvider } from '@/contexts/DeliveryContext';
import { LoginScreen } from '@/screens/LoginScreen';
import { SignupScreen } from '@/screens/SignupScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { DeliveryRunScreen } from '@/screens/DeliveryRunScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { Toaster } from '@/components/ui/sonner';

type Screen = 'login' | 'signup' | 'dashboard' | 'deliveryRun' | 'profile';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  // Auto-navigate to dashboard when user logs in
  React.useEffect(() => {
    if (user && currentScreen === 'login') {
      setCurrentScreen('dashboard');
    }
  }, [user, currentScreen]);

  if (!user) {
    return (
      <>
        {currentScreen === 'login' ? (
          <LoginScreen onNavigateToSignup={() => setCurrentScreen('signup')} />
        ) : (
          <SignupScreen onNavigateToLogin={() => setCurrentScreen('login')} />
        )}
        <Toaster />
      </>
    );
  }

  return (
    <DeliveryProvider>
      {currentScreen === 'dashboard' && (
        <DashboardScreen
          onNavigateToDeliveryRun={() => setCurrentScreen('deliveryRun')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}
      {currentScreen === 'deliveryRun' && (
        <DeliveryRunScreen onNavigateBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen onNavigateBack={() => setCurrentScreen('dashboard')} />
      )}
      <Toaster />
    </DeliveryProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
