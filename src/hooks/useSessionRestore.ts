import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to restore user session on app startup
 * This ensures users stay logged in after app reloads
 */
export const useSessionRestore = () => {
  const [isRestoring, setIsRestoring] = useState(true);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const restore = async () => {
      console.log('🚀 [useSessionRestore] Starting session restoration...');
      setIsRestoring(true);
      
      try {
        const restored = await restoreSession();
        console.log('✅ [useSessionRestore] Session restoration completed:', restored);
      } catch (error) {
        console.error('❌ [useSessionRestore] Error during session restoration:', error);
      } finally {
        setIsRestoring(false);
      }
    };

    restore();
  }, [restoreSession]);

  return {
    isRestoring,
    isLoading,
  };
};

