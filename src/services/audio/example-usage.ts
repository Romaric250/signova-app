/**
 * Example usage of the audio-to-text service
 * 
 * This file demonstrates how to use the audio-to-text transcription service
 * in your React Native components.
 */

import { transcribeAudio, useAudioToText } from './audioToText.ts';
import { Audio } from 'expo-av';
import { useState } from 'react';

// Example 1: Using the hook in a component
export const ExampleWithHook = () => {
  const { transcribe, isLoading, error, result, reset } = useAudioToText();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      // Request permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!recording) return;

    try {
      // Stop recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        // Transcribe the audio
        await transcribe(uri, {
          language: 'en', // Optional: specify language
          responseFormat: 'verbose_json', // Get detailed results with segments
        });
      }
    } catch (err) {
      console.error('Failed to transcribe', err);
    } finally {
      setRecording(null);
    }
  };

  return {
    startRecording,
    stopRecordingAndTranscribe,
    isLoading,
    error,
    result,
    reset,
    isRecording: recording !== null,
  };
};

// Example 2: Using the function directly
export const exampleDirectUsage = async (audioUri: string) => {
  try {
    const result = await transcribeAudio(audioUri, {
      language: 'en',
      temperature: 0.2,
      responseFormat: 'verbose_json',
    });

    console.log('Transcription:', result.text);
    console.log('Language detected:', result.language);
    
    if (result.segments) {
      console.log('Segments:', result.segments);
    }

    return result;
  } catch (error) {
    console.error('Transcription failed:', error);
    throw error;
  }
};

// Example 3: Recording with expo-av and transcribing
export const recordAndTranscribeExample = async () => {
  try {
    // Request permissions
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    // Start recording
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    // Wait for some time (or user action to stop)
    // In real app, you'd wait for user to press stop button
    await new Promise(resolve => setTimeout(resolve, 5000)); // Record for 5 seconds

    // Stop recording
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (!uri) {
      throw new Error('Recording URI is null');
    }

    // Transcribe
    const result = await transcribeAudio(uri, {
      language: 'en',
    });

    return result.text;
  } catch (error) {
    console.error('Error in record and transcribe:', error);
    throw error;
  }
};

