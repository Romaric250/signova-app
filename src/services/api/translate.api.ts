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
      { text: data.text, language: data.language }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to translate text');
  },

  transcribeAudio: async (audioUri: string, language: string): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);
    formData.append('language', language);

    const response = await apiClient.post<ApiResponse<{ text: string }>>(
      API_ENDPOINTS.TRANSLATE.TRANSCRIBE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.data.success && response.data.data) {
      return response.data.data.text;
    }
    throw new Error(response.data.message || 'Failed to transcribe audio');
  },

  getHistory: async (): Promise<TranslationResponse[]> => {
    const response = await apiClient.get<ApiResponse<TranslationResponse[]>>(
      API_ENDPOINTS.TRANSLATE.HISTORY
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch translation history');
  },
};

