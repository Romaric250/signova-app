import { OPENAI_API_KEY, API_BASE_URL } from '../../config/env';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import Constants from 'expo-constants';
import { API_ENDPOINTS } from '../../config/api.config';
import { apiClient } from '../api/client';
import { ApiResponse } from '../../types/api.types';

export interface TranscriptionOptions {
  language?: string; // ISO 639-1 language code (e.g., 'en', 'fr', 'es')
  prompt?: string; // Optional text to guide the model's style or continue a previous audio segment
  temperature?: number; // Sampling temperature between 0 and 1
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
}

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
  segments?: TranscriptionSegment[];
}

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface AudioToTextError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Converts audio file to text using OpenAI's Whisper API
 * @param audioUri - URI of the audio file (local file path)
 * @param options - Optional transcription options
 * @returns Promise with transcription result
 */
export const transcribeAudio = async (
  audioUri: string,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> => {
  console.log('[AudioToText] ========== STARTING TRANSCRIPTION ==========');
  console.log('[AudioToText] Audio URI:', audioUri);
  
  // Validate URI
  if (!audioUri || audioUri.trim() === '') {
    throw new Error('Audio URI is required');
  }
  
  // All platforms now use backend API, so no need to check OpenAI API key in the app
  // The API key is securely stored on the backend

  try {
    // Use backend API for ALL platforms (web and native)
    // This keeps API keys secure and provides consistent behavior
    if (Platform.OS === 'web') {
      console.log('[AudioToText] Web platform detected - using backend API to avoid CORS');
      
      // Convert audio URI to blob
      let blob: Blob;
      
      if (audioUri.startsWith('blob:')) {
        const response = await fetch(audioUri);
        blob = await response.blob();
      } else if (audioUri.startsWith('data:')) {
        const response = await fetch(audioUri);
        blob = await response.blob();
      } else {
        const response = await fetch(audioUri);
        blob = await response.blob();
      }
      
      console.log('[AudioToText] Web audio blob:', {
        size: blob.size,
        type: blob.type,
        uri: audioUri.substring(0, 50) + '...',
      });
      
      // Use backend API endpoint for web
      const formData = new FormData();
      formData.append('audio', blob, 'audio.m4a');
      
      const backendUrl = `${API_BASE_URL}${API_ENDPOINTS.TRANSLATE.TRANSCRIBE}`;
      console.log('[AudioToText] Sending to backend:', backendUrl);
      
      // Get auth token from storage
      const { getAuthToken } = await import('../storage/secureStorage');
      const token = await getAuthToken();
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          // Don't set Content-Type - browser will set it with boundary
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData: any = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('[AudioToText] Failed to parse error response:', errorText);
        }
        
        console.error('[AudioToText] Backend API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
        });
        
        const error: AudioToTextError = {
          message: errorData.error || errorData.message || `Backend API request failed with status ${response.status}`,
          code: errorData.code,
          statusCode: response.status,
        };
        throw error;
      }
      
      const result = await response.json();
      console.log('[AudioToText] Backend API Response:', result);
      
      if (result.success && result.data && result.data.text) {
        return {
          text: result.data.text,
          language: options.language || 'en',
        };
      }
      
      throw new Error(result.message || 'No transcription text in response');
    }
    
    // For native platforms, use backend API (consistent with web)
    // Use FileSystem.uploadAsync for reliable file upload on native
    console.log('[AudioToText] Native platform detected - using FileSystem.uploadAsync');
    
    // Get file extension from URI - handle various URI formats
    // Expo Audio typically records as .m4a on iOS and .3gp/.m4a on Android
    let fileExtension = 'm4a'; // Default to m4a (most compatible with Whisper)
    let mimeType = 'audio/m4a';
    
    // Try to extract extension from URI
    const uriParts = audioUri.split('.');
    if (uriParts.length > 1) {
      const ext = uriParts.pop()?.toLowerCase();
      if (ext && ['m4a', 'mp3', 'wav', '3gp', 'aac', 'ogg', 'webm', 'flac'].includes(ext)) {
        fileExtension = ext;
        mimeType = getMimeType(ext);
      }
    }
    
    // Log the detected format for debugging
    console.log('[AudioToText] Native audio file detected:', {
      uri: audioUri.substring(0, 100) + (audioUri.length > 100 ? '...' : ''),
      detectedExtension: fileExtension,
      mimeType: mimeType,
    });
    
    // Check if file exists first
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    console.log('[AudioToText] File info:', {
      exists: fileInfo.exists,
      size: fileInfo.exists ? (fileInfo as any).size : 0,
      uri: fileInfo.uri,
    });
    
    if (!fileInfo.exists) {
      throw new Error('Audio file does not exist at the specified URI');
    }
    
    // Log more details about the file for debugging
    const fileSizeKB = fileInfo.exists ? ((fileInfo as any).size / 1024).toFixed(2) : 0;
    console.log('[AudioToText] File size:', fileSizeKB, 'KB');
    
    // Warn if file is suspiciously small (likely empty/corrupt recording)
    if (fileInfo.exists && (fileInfo as any).size < 5000) {
      console.warn('[AudioToText] ⚠️ WARNING: Audio file is very small (<5KB)');
      console.warn('[AudioToText] This usually means:');
      console.warn('[AudioToText]   1. Recording was too short');
      console.warn('[AudioToText]   2. Microphone permission issue');
      console.warn('[AudioToText]   3. Emulator has no microphone access');
      console.warn('[AudioToText]   4. Recording failed silently');
    }
    
    // Use FileSystem.uploadAsync for native - this properly handles file:// URIs
    const backendUrl = `${API_BASE_URL}${API_ENDPOINTS.TRANSLATE.TRANSCRIBE}`;
    console.log('[AudioToText] ========== SENDING TO BACKEND (NATIVE) ==========');
    console.log('[AudioToText] Endpoint:', API_ENDPOINTS.TRANSLATE.TRANSCRIBE);
    console.log('[AudioToText] Full URL:', backendUrl);
    console.log('[AudioToText] Using FileSystem.uploadAsync for reliable native upload');
    
    try {
      // Get auth token from storage
      const { getAuthToken } = await import('../storage/secureStorage');
      const token = await getAuthToken();
      
      console.log('[AudioToText] Auth token present:', !!token);
      
      // Use FileSystem.uploadAsync - this is the recommended way to upload files in Expo
      const uploadResult = await FileSystem.uploadAsync(backendUrl, audioUri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'audio',
        mimeType: mimeType,
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      console.log('[AudioToText] ========== BACKEND API RESPONSE (NATIVE) ==========');
      console.log('[AudioToText] Status:', uploadResult.status);
      console.log('[AudioToText] Headers:', JSON.stringify(uploadResult.headers, null, 2));
      console.log('[AudioToText] Body:', uploadResult.body);
      
      if (uploadResult.status !== 200) {
        let errorData: any = {};
        try {
          errorData = JSON.parse(uploadResult.body);
        } catch (e) {
          console.error('[AudioToText] Failed to parse error response:', uploadResult.body);
        }
        
        console.error('[AudioToText] Backend API Error:', {
          status: uploadResult.status,
          errorData: errorData,
        });
        
        const error: AudioToTextError = {
          message: errorData.error || errorData.message || `Backend API request failed with status ${uploadResult.status}`,
          code: errorData.code,
          statusCode: uploadResult.status,
        };
        throw error;
      }
      
      const result = JSON.parse(uploadResult.body);
      console.log('[AudioToText] Response Data:', JSON.stringify(result, null, 2));
      
      // Backend returns: { success: true, data: { text: "..." } }
      if (result.success && result.data && result.data.text) {
        console.log('[AudioToText] ✅ Transcription successful!');
        console.log('[AudioToText] Transcribed text:', result.data.text);
        return {
          text: result.data.text,
          language: options.language || 'en',
        };
      }
      
      throw new Error(result.message || 'No transcription text in response');
    } catch (error: any) {
      console.error('[AudioToText] ========== BACKEND API ERROR (NATIVE) ==========');
      console.error('[AudioToText] Error Type:', error.constructor?.name || typeof error);
      console.error('[AudioToText] Error Message:', error.message);
      console.error('[AudioToText] Error Code:', error.code);
      console.error('[AudioToText] Error Status Code:', error.statusCode);
      console.error('[AudioToText] Full Error:', JSON.stringify(error, null, 2));
      
      // Check if it's a network error
      if (error.message?.includes('Network') || error.code === 'ERR_NETWORK' || error.name === 'TypeError') {
        console.error('[AudioToText] ⚠️  NETWORK ERROR DETECTED');
        console.error('[AudioToText] This usually means:');
        console.error('[AudioToText]   1. Backend server is not running');
        console.error('[AudioToText]   2. Network connectivity issue');
        console.error('[AudioToText]   3. Wrong API_BASE_URL configured');
        console.error('[AudioToText]   4. CORS issue (should not happen for native)');
        console.error('[AudioToText] Current API_BASE_URL:', API_BASE_URL);
        console.error('[AudioToText] Full URL would be:', `${API_BASE_URL}${API_ENDPOINTS.TRANSLATE.TRANSCRIBE}`);
      }
      
      console.error('[AudioToText] ===========================================');
      
      const errorMessage = error.message || 'Failed to transcribe audio';
      
      const audioError: AudioToTextError = {
        message: errorMessage,
        code: error.code,
        statusCode: error.statusCode || 500,
      };
      
      throw audioError;
    }
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    
    if (error.message) {
      throw error;
    }
    
    throw new Error(`Failed to transcribe audio: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Gets MIME type based on file extension
 */
const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/m4a', // iOS default recording format
    'aac': 'audio/aac', // Android sometimes uses this
    '3gp': 'audio/3gpp', // Android older format
    'ogg': 'audio/ogg',
    'webm': 'audio/webm',
    'flac': 'audio/flac',
    'mp4': 'audio/mp4',
    'amr': 'audio/amr', // Android sometimes uses this
  };
  
  const mimeType = mimeTypes[extension.toLowerCase()] || 'audio/m4a'; // Default to m4a for better compatibility
  console.log('[AudioToText] MIME type for', extension, ':', mimeType);
  return mimeType;
};

/**
 * Records audio and transcribes it
 * @param recordingUri - URI of the recorded audio file
 * @param options - Optional transcription options
 * @returns Promise with transcription result
 */
export const recordAndTranscribe = async (
  recordingUri: string,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> => {
  return transcribeAudio(recordingUri, options);
};

