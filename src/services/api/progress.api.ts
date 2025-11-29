import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import { UserProgress } from '@/types/user.types';
import { ApiResponse } from '@/types/api.types';

export const progressApi = {
  getProgress: async (): Promise<UserProgress> => {
    const response = await apiClient.get<ApiResponse<UserProgress>>(
      API_ENDPOINTS.LEARNING.PROGRESS
    );
    return response.data.data;
  },
};

