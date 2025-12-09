import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../config/env';
import { API_CONFIG } from '../../config/api.config';
import { getAuthToken, removeAuthToken } from '../storage/secureStorage';
import { ApiError } from '../../types/api.types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    console.log('🔌 Initializing API Client with baseURL:', API_BASE_URL);
    
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token and log request
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Comprehensive request logging
        console.log('📡 ========== REQUEST INTERCEPTOR ==========');
        console.log('🔗 Method:', config.method?.toUpperCase());
        console.log('🌐 Base URL:', config.baseURL);
        console.log('📍 Endpoint:', config.url);
        console.log('🔗 Full URL:', `${config.baseURL}${config.url}`);
        console.log('⏱️  Timeout:', config.timeout, 'ms');
        console.log('📋 Headers:', JSON.stringify(config.headers, null, 2));
        console.log('📦 Request Data:', JSON.stringify(config.data, null, 2));
        console.log('🔧 Request Config:', {
          method: config.method,
          url: config.url,
          baseURL: config.baseURL,
          params: config.params,
          timeout: config.timeout,
          withCredentials: config.withCredentials,
          responseType: config.responseType,
        });
        console.log('✅ Request configured and ready to send');
        console.log('==========================================');
        
        return config;
      },
      (error: AxiosError) => {
        console.log('❌ ========== REQUEST INTERCEPTOR ERROR ==========');
        console.log('Error:', error.message);
        console.log('Error config:', error.config);
        console.log('==========================================');
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors and log responses
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses
        console.log('✅ ========== RESPONSE INTERCEPTOR ==========');
        console.log('📥 Status:', response.status, response.statusText);
        console.log('🔗 URL:', response.config.url);
        console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
        console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));
        console.log('==========================================');
        return response;
      },
      async (error: AxiosError) => {
        // Comprehensive error logging
        console.log('❌ ========== RESPONSE INTERCEPTOR ERROR ==========');
        console.log('🔗 Request URL:', error.config?.url);
        console.log('🌐 Request Base URL:', error.config?.baseURL);
        console.log('📤 Request Method:', error.config?.method?.toUpperCase());
        console.log('📦 Request Data:', JSON.stringify(error.config?.data, null, 2));
        console.log('📋 Request Headers:', JSON.stringify(error.config?.headers, null, 2));
        
        if (error.response) {
          // Server responded with error
          console.log('📡 Server Response Received:');
          console.log('   Status:', error.response.status, error.response.statusText);
          console.log('   Headers:', JSON.stringify(error.response.headers, null, 2));
          console.log('   Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
          // Request was made but no response received
          console.log('📡 No Response Received (Network Error):');
          console.log('   Request:', JSON.stringify(error.request, null, 2));
          console.log('   Error Code:', error.code);
          console.log('   Error Message:', error.message);
        } else {
          // Error in request setup
          console.log('📡 Request Setup Error:');
          console.log('   Error Message:', error.message);
          console.log('   Error Code:', error.code);
        }
        console.log('==========================================');
        
        if (error.response?.status === 401) {
          // Token expired - logout user
          await removeAuthToken();
          // Navigation will be handled by auth context
        }

        // Handle backend error format: { success: false, error: "...", message: "..." }
        const errorData = error.response?.data;
        const apiError: ApiError = {
          message: errorData?.error || errorData?.message || error.message || 'An error occurred',
          code: error.code,
          statusCode: error.response?.status || 500,
          errors: errorData?.errors,
        };

        return Promise.reject(apiError);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();

