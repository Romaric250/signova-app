import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api/auth.api';
import { LoginCredentials, SignupData } from '../types/auth.types';
import { API_BASE_URL } from '../config/env';

export const useAuth = () => {
  // Log current API URL on hook init
  console.log('🔧 useAuth initialized - API_BASE_URL:', API_BASE_URL);
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setIsLoading,
  } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    console.log('🚀 useAuth.handleLogin called');
    try {
      setIsLoading(true);
      console.log('⏳ Calling authApi.login...');
      const response = await authApi.login(credentials);
      console.log('✅ authApi.login returned successfully');
      console.log('👤 User:', response.user?.email);
      await login(response.user, response.token);
      console.log('✅ Login state updated');
      return { success: true };
    } catch (error: any) {
      console.log('❌ useAuth.handleLogin error:', error.message);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      const response = await authApi.signup(data);
      await login(response.user, response.token);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await logout();
      setIsLoading(false);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};

