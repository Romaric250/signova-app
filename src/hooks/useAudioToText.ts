import { useState, useCallback } from 'react';
import { transcribeAudio, TranscriptionResult, TranscriptionOptions, AudioToTextError } from '../services/audio/audioToText.ts';

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

  return {
    transcribe,
    isLoading,
    error,
    result,
    reset,
  };
};

