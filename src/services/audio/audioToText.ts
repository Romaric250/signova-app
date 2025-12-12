import { OPENAI_API_KEY, API_BASE_URL } from '../../config/env';
import { Platform } from 'react-native';
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
    // Use fetch instead of axios for better React Native FormData support
    console.log('[AudioToText] Native platform detected - using backend API via fetch');
    
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
    
    // Create FormData for backend API (backend expects field name 'audio')
    // React Native FormData format: { uri, type, name }
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: mimeType,
      name: `audio.${fileExtension}`,
    } as any);
    
    console.log('[AudioToText] FormData created for native:', {
      hasAudio: true,
      uri: audioUri.substring(0, 50) + '...',
      type: mimeType,
      name: `audio.${fileExtension}`,
    });
    
    // Use fetch for native - it handles React Native FormData better than axios
    const backendUrl = `${API_BASE_URL}${API_ENDPOINTS.TRANSLATE.TRANSCRIBE}`;
    console.log('[AudioToText] ========== SENDING TO BACKEND (NATIVE) ==========');
    console.log('[AudioToText] Endpoint:', API_ENDPOINTS.TRANSLATE.TRANSCRIBE);
    console.log('[AudioToText] Full URL:', backendUrl);
    console.log('[AudioToText] API_BASE_URL:', API_BASE_URL);
    console.log('[AudioToText] FormData prepared with audio file');
    
    try {
      // Get auth token from storage
      const { getAuthToken } = await import('../storage/secureStorage');
      const token = await getAuthToken();
      
      console.log('[AudioToText] Auth token present:', !!token);
      
      // Use fetch - React Native's fetch handles FormData correctly
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          // Don't set Content-Type - React Native will set it with boundary for FormData
        },
        body: formData,
      });
      
      console.log('[AudioToText] ========== BACKEND API RESPONSE (NATIVE) ==========');
      console.log('[AudioToText] Status:', response.status, response.statusText);
      console.log('[AudioToText] Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
      
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
 * Creates FormData for web platform
 */
const createWebFormData = (audioBlob: Blob, options: TranscriptionOptions): FormData => {
  const formData = new FormData();
  
  // IMPORTANT: Model must be added BEFORE the file for some APIs
  // But OpenAI requires it, so let's add it first to be safe
  formData.append('model', 'whisper-1');
  
  // Append file - use proper filename with extension
  // Note: For web FormData, the third parameter (filename) is important
  const fileName = audioBlob.type.includes('m4a') ? 'audio.m4a' : 
                   audioBlob.type.includes('mp3') ? 'audio.mp3' : 
                   audioBlob.type.includes('wav') ? 'audio.wav' : 
                   'audio.m4a'; // default
  
  // Create a File object if possible, otherwise use Blob
  let fileToAppend: File | Blob = audioBlob;
  if (audioBlob instanceof File) {
    fileToAppend = audioBlob;
  } else {
    // Convert Blob to File-like object for better compatibility
    fileToAppend = new File([audioBlob], fileName, { type: audioBlob.type || 'audio/m4a' });
  }
  
  formData.append('file', fileToAppend, fileName);
  
  // Debug: Log what we're sending (for development)
  console.log('[AudioToText] Creating FormData:', {
    hasFile: !!audioBlob,
    fileSize: audioBlob.size,
    fileType: audioBlob.type,
    fileName: fileName,
    model: 'whisper-1',
    language: options.language,
    responseFormat: options.responseFormat,
    formDataKeys: ['model', 'file', ...(options.language ? ['language'] : []), ...(options.responseFormat ? ['response_format'] : [])],
  });
  
  // Set optimal defaults for accuracy if not provided
  const finalOptions = {
    language: options.language || 'en', // Default to English for better accuracy
    temperature: options.temperature !== undefined ? options.temperature : 0, // 0 = most accurate
    prompt: options.prompt || 'This is a clear speech recording. Transcribe accurately with proper punctuation and capitalization.',
    responseFormat: options.responseFormat || 'verbose_json',
  };
  
  console.log('[AudioToText] Using transcription options (web):', {
    language: finalOptions.language,
    temperature: finalOptions.temperature,
    hasPrompt: !!finalOptions.prompt,
    responseFormat: finalOptions.responseFormat,
  });
  
  // Append parameters to FormData
  formData.append('language', finalOptions.language);
  formData.append('temperature', finalOptions.temperature.toString());
  
  if (finalOptions.prompt) {
    formData.append('prompt', finalOptions.prompt);
  }
  
  if (finalOptions.responseFormat) {
    formData.append('response_format', finalOptions.responseFormat);
  }
  
  return formData;
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

