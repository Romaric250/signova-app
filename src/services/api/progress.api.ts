import { apiClient } from './client';
import { API_ENDPOINTS } from '../../config/api.config.ts';
import { UserProgress } from '../../types/user.types.ts';
import { ApiResponse } from '../../types/api.types.ts';

export const progressApi = {
  getProgress: async (): Promise<UserProgress> => {
    const response = await apiClient.get<ApiResponse<UserProgress>>(
      API_ENDPOINTS.PROGRESS.GET
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch progress');
  },

  updateProgress: async (data: Partial<UserProgress>): Promise<UserProgress> => {
    const response = await apiClient.post<ApiResponse<UserProgress>>(
      API_ENDPOINTS.PROGRESS.UPDATE,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update progress');
  },

  updateStreak: async (): Promise<void> => {
    const response = await apiClient.post(API_ENDPOINTS.PROGRESS.STREAK);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update streak');
    }
  },

  getAchievements: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      API_ENDPOINTS.PROGRESS.ACHIEVEMENTS
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch achievements');
  },
};

