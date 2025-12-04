import { apiClient } from './client';
import { API_ENDPOINTS } from '../../config/api.config.ts';
import { Sign, SignCategory, SignFilter } from '../../types/sign.types.ts';
import { ApiResponse, PaginatedResponse } from '../../types/api.types.ts';

export const signsApi = {
  getSigns: async (filter?: SignFilter): Promise<Sign[]> => {
    const response = await apiClient.get<ApiResponse<Sign[]>>(API_ENDPOINTS.SIGNS.LIST, {
      params: filter,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch signs');
  },

  searchSigns: async (query: string): Promise<Sign[]> => {
    const response = await apiClient.get<ApiResponse<Sign[]>>(API_ENDPOINTS.SIGNS.SEARCH, {
      params: { q: query },
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to search signs');
  },

  getSignById: async (id: string): Promise<Sign> => {
    const response = await apiClient.get<ApiResponse<Sign>>(
      API_ENDPOINTS.SIGNS.DETAIL.replace(':id', id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch sign');
  },

  getCategories: async (): Promise<SignCategory[]> => {
    // Backend doesn't have categories endpoint, return empty array for now
    // This can be derived from signs data
    return [];
  },

  getFavorites: async (): Promise<Sign[]> => {
    const response = await apiClient.get<ApiResponse<Sign[]>>(API_ENDPOINTS.SIGNS.FAVORITES);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch favorites');
  },

  addToFavorites: async (signId: string): Promise<void> => {
    const response = await apiClient.post(API_ENDPOINTS.SIGNS.FAVORITES, { signId });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add favorite');
    }
  },

  removeFromFavorites: async (signId: string): Promise<void> => {
    const response = await apiClient.delete(
      API_ENDPOINTS.SIGNS.FAVORITES.replace('/favorites', `/favorites/${signId}`)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove favorite');
    }
  },
};

