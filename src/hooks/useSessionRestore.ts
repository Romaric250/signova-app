import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import * as SplashScreen from 'expo-splash-screen';

/**
 * Hook to restore user session on app startup
 * This ensures users stay logged in after app reloads
 * Includes timeout to prevent indefinite loading
 */
const SESSION_RESTORE_TIMEOUT = 8000; // 8 seconds max

export const useSessionRestore = () => {
  const [isRestoring, setIsRestoring] = useState(true);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const restore = async () => {
      console.log('🚀 [useSessionRestore] Starting session restoration...');
      setIsRestoring(true);
      
      // Set timeout to force completion
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('⏰ [useSessionRestore] Session restoration timeout - forcing completion');
          setIsRestoring(false);
          // Ensure splash screen is hidden even on timeout
          SplashScreen.hideAsync().catch(() => {});
        }
      }, SESSION_RESTORE_TIMEOUT);
      
      try {
        const restored = await restoreSession();
        console.log('✅ [useSessionRestore] Session restoration completed:', restored);
      } catch (error) {
        console.error('❌ [useSessionRestore] Error during session restoration:', error);
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId);
          setIsRestoring(false);
          // Always hide splash screen when done
          try {
            await SplashScreen.hideAsync();
          } catch (error) {
            console.warn('[useSessionRestore] Error hiding splash screen:', error);
          }
        }
      }
    };

    restore();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [restoreSession]);

  return {
    isRestoring,
    isLoading,
  };
};

