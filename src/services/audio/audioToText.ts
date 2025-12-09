import { OPENAI_API_KEY, API_BASE_URL } from '../../config/env';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { API_ENDPOINTS } from '../../config/api.config';

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
  
  // For native platforms, check OpenAI API key (web uses backend API)
  if (Platform.OS !== 'web') {
    // Debug: Log API key status (only first few chars for security)
    const keyPrefix = OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 7)}...` : 'NOT SET';
    console.log('[AudioToText] API Key check:', keyPrefix);
    
    if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
      console.error('[AudioToText] ❌ OpenAI API key is missing!');
      console.error('[AudioToText] Available env vars:', {
        hasExpoConfig: !!Constants.expoConfig,
        extraKeys: Constants.expoConfig?.extra ? Object.keys(Constants.expoConfig.extra) : [],
        hasProcessEnv: !!process.env.OPENAI_API_KEY,
      });
      console.error('[AudioToText] 📝 To fix: Create a .env file in the project root with:');
      console.error('[AudioToText]    OPENAI_API_KEY=sk-your-actual-api-key-here');
      console.error('[AudioToText]    Then restart the Expo development server.');
      throw new Error('OpenAI API key is not configured. Please create a .env file with OPENAI_API_KEY=sk-your-key-here and restart the server.');
    }
    
    // Validate API key format (should start with 'sk-')
    if (!OPENAI_API_KEY.startsWith('sk-')) {
      console.error('[AudioToText] ⚠️  Warning: API key format appears invalid (should start with "sk-")');
      console.error('[AudioToText] Current key prefix:', OPENAI_API_KEY.substring(0, 10));
    }
  }

  try {
    // For web platform, use backend API to avoid CORS issues
    // For native platforms, call OpenAI directly (no CORS issues)
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
    
    // For native platforms, use OpenAI directly (no CORS issues)
    // For native (React Native), use FormData
    const formData = new FormData();
      
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
        uriParts: uriParts.length,
      });
      
      // Append file to FormData - React Native FormData format
      // The name must have proper extension for Whisper to recognize format
      formData.append('file', {
        uri: audioUri,
        type: mimeType,
        name: `audio.${fileExtension}`,
      } as any);
      
      // IMPORTANT: Model must be specified
      formData.append('model', 'whisper-1');
      
      // Set optimal defaults for accuracy if not provided
      const finalOptions = {
        language: options.language || 'en', // Default to English for better accuracy
        temperature: options.temperature !== undefined ? options.temperature : 0, // 0 = most accurate
        prompt: options.prompt || 'This is a clear speech recording. Transcribe accurately with proper punctuation and capitalization.',
        responseFormat: options.responseFormat || 'verbose_json',
      };
      
      console.log('[AudioToText] Using transcription options:', {
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

      console.log('[AudioToText] FormData prepared for native:', {
        hasFile: true,
        fileName: `audio.${fileExtension}`,
        mimeType: mimeType,
        model: 'whisper-1',
        language: options.language || 'auto',
        responseFormat: options.responseFormat || 'json',
      });

    // Log request details before sending (native platforms only)
    console.log('[AudioToText] ========== SENDING TO OPENAI (NATIVE) ==========');
    console.log('[AudioToText] Platform:', Platform.OS);
    console.log('[AudioToText] Audio URI:', audioUri.substring(0, 100) + (audioUri.length > 100 ? '...' : ''));
    console.log('[AudioToText] Options:', JSON.stringify(options, null, 2));
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        // Don't set Content-Type for FormData - native will set it with boundary
      },
      body: formData,
    });
    
    console.log('[AudioToText] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        console.error('[AudioToText] Failed to parse error response. Raw text:', errorText);
      }
      
      console.error('[AudioToText] API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        errorText: errorText.substring(0, 200), // First 200 chars
      });
      
      const error: AudioToTextError = {
        message: errorData.error?.message || errorData.message || `API request failed with status ${response.status}`,
        code: errorData.error?.code || errorData.code,
        statusCode: response.status,
      };
      throw error;
    }

    const result = await response.json();
    
    console.log('[AudioToText] ========== TRANSCRIPTION RESULT ==========');
    console.log('[AudioToText] Detected language:', result.language);
    console.log('[AudioToText] Transcription text:', result.text);
    console.log('[AudioToText] Full result:', JSON.stringify(result, null, 2));

    // Handle different response formats
    // Use the responseFormat from options, or default to verbose_json
    const responseFormat = options.responseFormat || 'verbose_json';
    
    if (responseFormat === 'verbose_json' && result.segments) {
      const transcriptionResult = {
        text: result.text,
        language: result.language,
        duration: result.duration,
        segments: result.segments.map((seg: any) => ({
          id: seg.id,
          start: seg.start,
          end: seg.end,
          text: seg.text,
        })),
      };
      console.log('[AudioToText] Returning verbose_json format with', transcriptionResult.segments.length, 'segments');
      return transcriptionResult;
    }

    const simpleResult = {
      text: result.text || result,
      language: result.language,
    };
    console.log('[AudioToText] Returning simple format');
    return simpleResult;
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

