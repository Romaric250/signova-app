import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import { LoginCredentials, SignupData, AuthResponse } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    // Backend returns { success: true, data: {...} }
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...signupPayload } = data;
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.SIGNUP,
      signupPayload
    );
    // Backend returns { success: true, data: {...} }
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Signup failed');
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    // Backend returns { success: true, data: {...} }
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Token refresh failed');
  },

  forgotPassword: async (email: string): Promise<void> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send password reset email');
    }
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
  },
};

