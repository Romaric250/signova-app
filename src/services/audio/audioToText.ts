import { OPENAI_API_KEY } from '../../config/env.ts';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

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

  try {
    // Read the file as base64 for web, or use FormData for native
    let audioData: FormData | Blob;
    let contentType: string;

    if (Platform.OS === 'web') {
      // For web, we need to convert to blob
      // Handle both blob URLs and data URLs
      let blob: Blob;
      
      if (audioUri.startsWith('blob:')) {
        // It's already a blob URL
        const response = await fetch(audioUri);
        blob = await response.blob();
      } else if (audioUri.startsWith('data:')) {
        // It's a data URL
        const response = await fetch(audioUri);
        blob = await response.blob();
      } else {
        // Try to fetch it
        const response = await fetch(audioUri);
        blob = await response.blob();
      }
      
      audioData = blob;
      contentType = blob.type || 'audio/m4a';
      console.log('[AudioToText] Web audio blob:', {
        size: blob.size,
        type: blob.type,
        uri: audioUri.substring(0, 50) + '...',
      });
    } else {
      // For native, use FormData
      const formData = new FormData();
      
      // Get file extension to determine content type
      const fileExtension = audioUri.split('.').pop()?.toLowerCase();
      const mimeType = getMimeType(fileExtension || 'm4a');
      
      formData.append('file', {
        uri: audioUri,
        type: mimeType,
        name: `audio.${fileExtension || 'm4a'}`,
      } as any);
      
      if (options.language) {
        formData.append('language', options.language);
      }
      if (options.prompt) {
        formData.append('prompt', options.prompt);
      }
      if (options.temperature !== undefined) {
        formData.append('temperature', options.temperature.toString());
      }
      if (options.responseFormat) {
        formData.append('response_format', options.responseFormat);
      }
      formData.append('model', 'whisper-1');

      audioData = formData;
      contentType = 'multipart/form-data';
    }

    // Make API request to OpenAI
    // For web, we need to use FormData (not Blob directly)
    const formDataToSend = Platform.OS === 'web' 
      ? createWebFormData(audioData as Blob, options)
      : audioData as FormData;

    // Debug: Verify FormData contents (for web)
    if (Platform.OS === 'web') {
      console.log('[AudioToText] Sending FormData to OpenAI...');
      // Try to log FormData entries (note: FormData.entries() might not work in all browsers)
      const formDataEntries: string[] = [];
      try {
        for (const [key, value] of (formDataToSend as FormData).entries()) {
          if (value instanceof File || value instanceof Blob) {
            formDataEntries.push(`${key}: [File/Blob, size: ${value.size}, type: ${value.type}]`);
          } else {
            formDataEntries.push(`${key}: ${value}`);
          }
        }
        console.log('[AudioToText] FormData entries:', formDataEntries);
      } catch (e) {
        console.log('[AudioToText] Could not iterate FormData entries:', e);
      }
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formDataToSend,
    });

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

    // Handle different response formats
    if (options.responseFormat === 'verbose_json' && result.segments) {
      return {
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
    }

    return {
      text: result.text || result,
      language: result.language,
    };
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
  
  if (options.language) {
    formData.append('language', options.language);
  }
  if (options.prompt) {
    formData.append('prompt', options.prompt);
  }
  if (options.temperature !== undefined) {
    formData.append('temperature', options.temperature.toString());
  }
  if (options.responseFormat) {
    formData.append('response_format', options.responseFormat);
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
    'm4a': 'audio/m4a',
    'ogg': 'audio/ogg',
    'webm': 'audio/webm',
    'flac': 'audio/flac',
    'mp4': 'audio/mp4',
  };
  
  return mimeTypes[extension] || 'audio/mpeg';
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

