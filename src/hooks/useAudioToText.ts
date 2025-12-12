import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { transcribeAudio, TranscriptionResult, TranscriptionOptions, AudioToTextError } from '../services/audio/audioToText';

interface UseAudioToTextReturn {
  transcribe: (audioUri: string, options?: TranscriptionOptions) => Promise<TranscriptionResult>;
  isLoading: boolean;
  error: AudioToTextError | null;
  result: TranscriptionResult | null;
  reset: () => void;
}

/**
 * Hook for audio-to-text transcription using OpenAI Whisper API
 * @returns Object with transcribe function, loading state, error, result, and reset function
 */
export const useAudioToText = (): UseAudioToTextReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AudioToTextError | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const transcribe = useCallback(async (
    audioUri: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const transcriptionResult = await transcribeAudio(audioUri, options);
      setResult(transcriptionResult);
      return transcriptionResult;
    } catch (err: any) {
      const audioError: AudioToTextError = {
        message: err.message || 'Failed to transcribe audio',
        code: err.code,
        statusCode: err.statusCode,
      };
      setError(audioError);
      throw audioError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setIsLoading(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Audio recording permission not granted');
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Configure recording options based on platform
      // OpenAI Whisper supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
      const recordingOptions = Platform.OS === 'android' 
        ? {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
            android: {
              extension: '.m4a',
              outputFormat: Audio.AndroidOutputFormat.MPEG_4,
              audioEncoder: Audio.AndroidAudioEncoder.AAC,
              sampleRate: 44100,
              numberOfChannels: 1,
              bitRate: 128000,
            },
            ios: {
              extension: '.m4a',
              audioQuality: Audio.IOSAudioQuality.HIGH,
              sampleRate: 44100,
              numberOfChannels: 1,
              bitRate: 128000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
            web: {
              mimeType: 'audio/webm',
              bitsPerSecond: 128000,
            },
          }
        : Audio.RecordingOptionsPresets.HIGH_QUALITY;

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      
      recordingRef.current = recording;
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, []);

  return {
    transcribe,
    isLoading,
    error,
    result,
    reset,
  };
};

