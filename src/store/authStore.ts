import { create } from 'zustand';
import { User, AuthState } from '../types/auth.types.ts';
import { 
  setAuthToken, 
  getAuthToken,
  removeAuthToken, 
  setUserData, 
  getUserData, 
  removeUserData 
} from '../services/storage/secureStorage.ts';
import { authApi } from '../services/api/auth.api';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: async (token) => {
    if (token) {
      await setAuthToken(token);
      set({ token });
    } else {
      await removeAuthToken();
      set({ token: null });
    }
  },

  login: async (user, token) => {
    // Skip SecureStore for development/web - just set state directly
    try {
      await setAuthToken(token);
      // Store user data for session restoration
      await setUserData(JSON.stringify(user));
    } catch (error) {
      // Ignore SecureStore errors on web/development
      console.log('SecureStore not available, using in-memory storage');
    }
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await removeAuthToken();
      await removeUserData();
    } catch (error) {
      console.log('Error removing auth data:', error);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  restoreSession: async () => {
    console.log('🔄 ========== RESTORING SESSION ==========');
    set({ isLoading: true });
    
    try {
      // First, try to get stored token
      const storedToken = await getAuthToken();
      
      if (!storedToken) {
        console.log('❌ No stored token found');
        set({ isLoading: false, isAuthenticated: false });
        return false;
      }

      console.log('🔑 Found stored token, validating with server...');
      
      // Validate session with backend
      const sessionData = await authApi.getSession();
      
      if (sessionData && sessionData.user && sessionData.token) {
        console.log('✅ Session restored successfully!');
        console.log('👤 User:', sessionData.user.email);
        
        // Update stored user data
        await setUserData(JSON.stringify(sessionData.user));
        await setAuthToken(sessionData.token);
        
        set({
          user: sessionData.user,
          token: sessionData.token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return true;
      }
      
      console.log('❌ Invalid session data received');
      set({ isLoading: false, isAuthenticated: false });
      return false;
    } catch (error: any) {
      console.log('❌ Session restoration failed:', error.message);
      
      // If session is invalid, clear stored data
      try {
        await removeAuthToken();
        await removeUserData();
      } catch (clearError) {
        console.log('Error clearing invalid session data:', clearError);
      }
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return false;
    }
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
}));

