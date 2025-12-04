import { useState, useEffect } from 'react';
import { getOnboardingCompleted } from '../services/storage/localStorage.ts';
import { Platform } from 'react-native';

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkOnboarding = async () => {
      try {
        // Add timeout to prevent hanging - reduced to 1 second for faster loading
        const timeoutPromise = new Promise<boolean>((resolve) => {
          timeoutId = setTimeout(() => {
            console.warn(`[${Platform.OS}] Onboarding check timeout, defaulting to false`);
            if (isMounted) {
              setIsOnboardingCompleted(false);
              setIsLoading(false);
            }
            resolve(false);
          }, 1000); // 1 second timeout - faster response
        });

        const checkPromise = getOnboardingCompleted().then((completed) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          return completed;
        });

        const completed = await Promise.race([checkPromise, timeoutPromise]);
        
        if (isMounted) {
          console.log(`[${Platform.OS}] Onboarding completed status:`, completed, typeof completed);
          setIsOnboardingCompleted(Boolean(completed));
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`[${Platform.OS}] Error checking onboarding status:`, error);
        if (isMounted) {
          setIsOnboardingCompleted(false);
          setIsLoading(false);
        }
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return {
    isOnboardingCompleted,
    isLoading,
  };
};

