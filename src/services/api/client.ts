import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/env';
import { API_CONFIG } from '@/config/api.config';
import { getAuthToken, removeAuthToken } from '@/services/storage/secureStorage';
import { ApiError } from '@/types/api.types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
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
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
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

