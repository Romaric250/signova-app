import { apiClient } from './client';
import { API_ENDPOINTS } from '../../config/api.config';
import { LoginCredentials, SignupData, AuthResponse } from '../../types/auth.types';
import { ApiResponse } from '../../types/api.types';
import { API_BASE_URL } from '../../config/env';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const fullUrl = `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
    console.log('🔐 ========== LOGIN ATTEMPT ==========');
    console.log('🌐 Full URL:', fullUrl);
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Password:', '***' + credentials.password?.slice(-3));
    console.log('📦 Complete Payload:', JSON.stringify({
      email: credentials.email,
      password: '***' + credentials.password?.slice(-3) + ' (hidden)',
    }, null, 2));
    
    try {
      // Validate input before sending
      if (!credentials.email || !credentials.password) {
        console.log('❌ Validation failed: Email or password missing');
        throw new Error('Email and password are required');
      }

      console.log('📤 Preparing to send POST request to:', API_ENDPOINTS.AUTH.LOGIN);
      console.log('📋 Request will be sent with:', {
        method: 'POST',
        url: API_ENDPOINTS.AUTH.LOGIN,
        baseURL: API_BASE_URL,
        data: {
          email: credentials.email,
          password: '***' + credentials.password?.slice(-3) + ' (hidden)',
        },
      });
      
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      console.log('📥 ========== LOGIN RESPONSE RECEIVED ==========');
      console.log('✅ Status:', response.status, response.statusText);
      console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
      console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));
      console.log('🔍 Response Summary:', {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
        hasUser: !!response.data?.data?.user,
        hasToken: !!response.data?.data?.token,
      });
      
      // Backend returns { success: true, data: {...} }
      if (response.data.success && response.data.data) {
        console.log('✅ Login successful!');
        console.log('👤 User ID:', response.data.data.user?.id);
        console.log('📧 User Email:', response.data.data.user?.email);
        console.log('🎫 Token present:', !!response.data.data.token);
        return response.data.data;
      }
      console.log('❌ Login failed - no data in response');
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      console.log('❌ ========== LOGIN ERROR DETAILED ==========');
      console.log('🔍 Error Object Type:', error.constructor.name);
      console.log('📝 Error Message:', error.message);
      console.log('🔢 Error Code:', error.code);
      console.log('📦 Complete Error Object:', JSON.stringify({
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5), // First 5 stack lines
      }, null, 2));
      
      // Extract user-friendly error message with better handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        const statusCode = error.response.status;
        const errorData = error.response.data;
        console.log('📡 ========== SERVER ERROR RESPONSE ==========');
        console.log('   Status Code:', statusCode);
        console.log('   Status Text:', error.response.statusText);
        console.log('   Response Headers:', JSON.stringify(error.response.headers, null, 2));
        console.log('   Response Data:', JSON.stringify(errorData, null, 2));
        console.log('   Request Config:', {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        });
        
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
        console.log('📡 ========== NETWORK ERROR (NO RESPONSE) ==========');
        console.log('   Request Object:', JSON.stringify({
          readyState: error.request?.readyState,
          status: error.request?.status,
          statusText: error.request?.statusText,
        }, null, 2));
        console.log('   Request Config:', {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout,
          headers: error.config?.headers,
          data: error.config?.data ? {
            email: error.config.data.email,
            password: '***' + (error.config.data.password?.slice(-3) || ''),
          } : null,
        });
        console.log('   Full URL Attempted:', error.config?.baseURL + error.config?.url);
        console.log('   Error Code:', error.code);
        console.log('   Error Message:', error.message);
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Error in request setup
        console.log('📡 ========== REQUEST SETUP ERROR ==========');
        console.log('   Error Message:', error.message);
        console.log('   Error Code:', error.code);
        console.log('   Error Name:', error.name);
        console.log('   Error Stack:', error.stack);
        errorMessage = error.message;
      }
      
      console.log('🔴 Final Error Message:', errorMessage);
      console.log('==========================================');
      throw new Error(errorMessage);
    }
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    console.log('📝 ========== SIGNUP ATTEMPT ==========');
    console.log('📧 Email:', data.email);
    console.log('👤 Name:', data.name);
    
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...signupPayload } = data;
      console.log('📤 Sending signup request...');
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.SIGNUP,
        signupPayload
      );
      console.log('📥 Signup response:', response.data?.success);
      
      // Backend returns { success: true, data: {...} }
      if (response.data.success && response.data.data) {
        console.log('✅ Signup successful!');
        return response.data.data;
      }
      throw new Error(response.data.message || 'Signup failed');
    } catch (error: any) {
      console.log('❌ Signup error:', error.message);
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

