import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import { Sign, SignCategory, SignFilter } from '@/types/sign.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const signsApi = {
  getSigns: async (filter?: SignFilter): Promise<Sign[]> => {
    const response = await apiClient.get<ApiResponse<Sign[]>>(API_ENDPOINTS.SIGNS.LIST, {
      params: filter,
    });
    return response.data.data;
  },

  searchSigns: async (query: string): Promise<Sign[]> => {
    const response = await apiClient.get<ApiResponse<Sign[]>>(API_ENDPOINTS.SIGNS.SEARCH, {
      params: { q: query },
    });
    return response.data.data;
  },

  getSignById: async (id: string): Promise<Sign> => {
    const response = await apiClient.get<ApiResponse<Sign>>(
      API_ENDPOINTS.SIGNS.DETAIL.replace(':id', id)
    );
    return response.data.data;
  },

  getCategories: async (): Promise<SignCategory[]> => {
    const response = await apiClient.get<ApiResponse<SignCategory[]>>(
      API_ENDPOINTS.SIGNS.CATEGORIES
    );
    return response.data.data;
  },

  getFavorites: async (): Promise<Sign[]> => {
    const response = await apiClient.get<ApiResponse<Sign[]>>(API_ENDPOINTS.SIGNS.FAVORITES);
    return response.data.data;
  },

  toggleFavorite: async (signId: string): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.SIGNS.FAVORITES}/${signId}`);
  },
};

