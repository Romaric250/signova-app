import { useState, useEffect } from 'react';
import { getOnboardingCompleted } from '@/services/storage/localStorage';

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await getOnboardingCompleted();
        setIsOnboardingCompleted(completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
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

