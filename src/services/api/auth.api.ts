import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import { LoginCredentials, SignupData, AuthResponse } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Validate input before sending
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      // Backend returns { success: true, data: {...} }
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      // Extract user-friendly error message with better handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        const statusCode = error.response.status;
        const errorData = error.response.data;
        
        if (statusCode === 400 || statusCode === 401) {
          // Bad request or unauthorized - use the error message from server
          errorMessage = errorData?.error || errorData?.message || 'Invalid email or password';
        } else if (statusCode === 404) {
          errorMessage = 'No account found with this email';
        } else if (statusCode === 422) {
          errorMessage = errorData?.error || errorData?.message || 'Please check your email and password';
        } else if (statusCode >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        // Error in request setup
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
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
    } catch (error: any) {
      // Extract user-friendly error message
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Signup failed. Please try again.';
      throw new Error(errorMessage);
    }
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

