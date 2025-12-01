# Audio-to-Text Module

This module provides audio-to-text transcription functionality using OpenAI's Whisper API.

## Setup

1. **Add your OpenAI API key to environment variables:**

   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=sk-proj-your-api-key-here
   ```

   Or add it to `app.config.js`:
   ```javascript
   extra: {
     OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
   }
   ```

2. **The API key is already configured** in `app.config.js` and `src/config/env.ts`

## Usage

### Option 1: Using the Hook (Recommended)

```typescript
import { useAudioToText } from '@/hooks/useAudioToText';
import { Audio } from 'expo-av';

const MyComponent = () => {
  const { transcribe, isLoading, error, result, reset } = useAudioToText();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
  };

  const stopAndTranscribe = async () => {
    if (!recording) return;
    
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    if (uri) {
      await transcribe(uri, {
        language: 'en', // Optional
        responseFormat: 'verbose_json', // Optional
      });
    }
    
    setRecording(null);
  };

  return (
    <View>
      {result && <Text>{result.text}</Text>}
      {isLoading && <ActivityIndicator />}
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
};
```

### Option 2: Using the Function Directly

```typescript
import { transcribeAudio } from '@/services/audio/audioToText';

const transcribe = async (audioUri: string) => {
  try {
    const result = await transcribeAudio(audioUri, {
      language: 'en',
      temperature: 0.2,
      responseFormat: 'verbose_json',
    });
    
    console.log('Transcription:', result.text);
    console.log('Language:', result.language);
    
    if (result.segments) {
      console.log('Segments:', result.segments);
    }
    
    return result;
  } catch (error) {
    console.error('Transcription failed:', error);
  }
};
```

## API Reference

### `transcribeAudio(audioUri, options?)`

Transcribes an audio file to text.

**Parameters:**
- `audioUri` (string): URI of the audio file (local file path)
- `options` (TranscriptionOptions, optional):
  - `language` (string): ISO 639-1 language code (e.g., 'en', 'fr', 'es')
  - `prompt` (string): Optional text to guide the model's style
  - `temperature` (number): Sampling temperature between 0 and 1
  - `responseFormat` ('json' | 'text' | 'srt' | 'verbose_json' | 'vtt'): Response format

**Returns:** `Promise<TranscriptionResult>`

**TranscriptionResult:**
```typescript
{
  text: string;
  language?: string;
  duration?: number;
  segments?: TranscriptionSegment[];
}
```

### `useAudioToText()`

React hook for audio transcription.

**Returns:**
```typescript
{
  transcribe: (audioUri: string, options?: TranscriptionOptions) => Promise<TranscriptionResult>;
  isLoading: boolean;
  error: AudioToTextError | null;
  result: TranscriptionResult | null;
  reset: () => void;
}
```

## Supported Audio Formats

- MP3
- WAV
- M4A
- OGG
- WebM
- FLAC
- MP4

## Example Integration

See `src/screens/main/LiveCaptionsScreen.tsx` for a complete example of integrating audio-to-text functionality with recording.

## Notes

- Make sure microphone permissions are granted before recording
- The module handles both web and native platforms
- For web, audio files are converted to Blob format
- For native, FormData is used to send audio files
- The API key is securely stored in environment variables

