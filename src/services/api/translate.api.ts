import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import { ApiResponse } from '@/types/api.types';

export interface TranslationRequest {
  text?: string;
  audioUri?: string;
  language: string;
}

export interface TranslationResponse {
  signVideoUrl: string;
  text: string;
  timestamp: string;
}

export const translateApi = {
  translateText: async (data: TranslationRequest): Promise<TranslationResponse> => {
    const response = await apiClient.post<ApiResponse<TranslationResponse>>(
      API_ENDPOINTS.TRANSLATE.TEXT_TO_SIGN,
      data
    );
    return response.data.data;
  },

  translateSpeech: async (data: TranslationRequest): Promise<TranslationResponse> => {
    const formData = new FormData();
    if (data.audioUri) {
      formData.append('audio', {
        uri: data.audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
    }
    formData.append('language', data.language);

    const response = await apiClient.post<ApiResponse<TranslationResponse>>(
      API_ENDPOINTS.TRANSLATE.SPEECH_TO_SIGN,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  getHistory: async (): Promise<TranslationResponse[]> => {
    const response = await apiClient.get<ApiResponse<TranslationResponse[]>>(
      API_ENDPOINTS.TRANSLATE.HISTORY
    );
    return response.data.data;
  },
};

