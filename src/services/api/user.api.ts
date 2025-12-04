import { apiClient } from './client';
import { API_ENDPOINTS } from '../../config/api.config.ts';
import { UserProfile } from '../../types/user.types.ts';
import { ApiResponse } from '../../types/api.types.ts';

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USER.PROFILE);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch profile');
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update profile');
  },

  updatePreferences: async (preferences: Record<string, any>): Promise<void> => {
    const response = await apiClient.patch(API_ENDPOINTS.USER.PREFERENCES, preferences);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update preferences');
    }
  },
};

