import { useState, useEffect } from 'react';
import { getOnboardingCompleted, debugStorage } from '@/services/storage/localStorage';
import { Platform } from 'react-native';

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // Debug storage on native platforms
        if (Platform.OS !== 'web') {
          await debugStorage();
        }
        
        const completed = await getOnboardingCompleted();
        console.log(`[${Platform.OS}] Onboarding completed status:`, completed, typeof completed);
        // Ensure it's always a boolean
        setIsOnboardingCompleted(Boolean(completed));
      } catch (error) {
        console.error(`[${Platform.OS}] Error checking onboarding status:`, error);
        setIsOnboardingCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  return {
    isOnboardingCompleted,
    isLoading,
  };
};

