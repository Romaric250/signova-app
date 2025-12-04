import { useAuthStore } from '../store/authStore.ts';
import { authApi } from '../services/api/auth.api.ts';
import { LoginCredentials, SignupData } from '../types/auth.types.ts';

export const useAuth = () => {
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
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      await login(response.user, response.token);
      return { success: true };
    } catch (error: any) {
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

