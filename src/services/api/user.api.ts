import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import { UserProfile } from '@/types/user.types';
import { ApiResponse } from '@/types/api.types';

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USER.PROFILE);
    return response.data.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    return response.data.data;
  },

  uploadAvatar: async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      API_ENDPOINTS.USER.AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.avatarUrl;
  },
};

