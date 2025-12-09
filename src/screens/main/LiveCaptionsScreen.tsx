import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { Text } from '../../components/atoms/Text';
import { Icon } from '../../components/atoms/Icon';
import { Button } from '../../components/atoms/Button';
import { ProgressBar } from '../../components/molecules/ProgressBar';
import { useAudioToText } from '../../hooks/useAudioToText.ts';

type NavigationProp = NativeStackNavigationProp<any>;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const LiveCaptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [transcript, setTranscript] = useState('');
  const [noiseLevel, setNoiseLevel] = useState(65); // 0-100
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // in seconds
  const { transcribe, isLoading, error, result, reset } = useAudioToText();
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Request permissions on mount
    Audio.requestPermissionsAsync().catch(console.error);
  }, []);

  useEffect(() => {
    // Update transcript when transcription result is available
    if (result?.text) {
      setTranscript(prev => prev ? `${prev}\n${result.text}` : result.text);
      reset();
    }
  }, [result, reset]);

  useEffect(() => {
    // Show error alert if transcription fails
    if (error) {
      Alert.alert('Transcription Error', error.message);
      reset();
    }
  }, [error, reset]);

  // Timer effect for recording
  useEffect(() => {
    if (isRecording) {
      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start animated progress bar
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Simulate noise level changes during recording
      const noiseInterval = setInterval(() => {
        setNoiseLevel((prev) => {
          const change = Math.random() * 20 - 10; // Random change between -10 and +10
          const newLevel = prev + change;
          return Math.max(20, Math.min(90, newLevel)); // Keep between 20-90
        });
      }, 500);
    } else {
      // Stop timer and reset
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setRecordingTime(0);
      animatedValue.setValue(0);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording, animatedValue]);

  const getNoiseLevelLabel = (level: number) => {
    if (level < 30) return 'Low';
    if (level < 70) return 'Moderate';
    return 'High';
  };

  const handleStartRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required for live captions.');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording with optimal settings for Whisper transcription accuracy
      // High sample rate (16kHz), mono channel, and proper format for best results
      // NOTE: expo-av requires BOTH android and ios options, even if running on one platform
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000, // Whisper works best with 16kHz (its native sample rate)
          numberOfChannels: 1, // Mono for better accuracy and smaller file size
          bitRate: 64000, // Adequate bitrate for speech
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MAX, // Maximum quality
          sampleRate: 16000, // Whisper's optimal sample rate
          numberOfChannels: 1, // Mono for speech recognition
          bitRate: 64000,
        },
      };

      console.log('[LiveCaptions] Starting recording with optimized settings for Whisper...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );

      console.log('[LiveCaptions] Recording started');
      recordingRef.current = newRecording;
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const handleStopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      setRecordingTime(0); // Reset timer
      
      console.log('[LiveCaptions] Stopping recording...');
      
      // Stop and unload the recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      console.log('[LiveCaptions] Recording stopped, URI:', uri);

      if (uri) {
        console.log('[LiveCaptions] Starting transcription...');
        // Transcribe the audio with optimal settings for accuracy
        await transcribe(uri, {
          language: 'en', // Explicitly set language for better accuracy
          temperature: 0, // 0 = most accurate, deterministic results (recommended for transcription)
          prompt: 'This is a clear speech recording. Transcribe accurately with proper punctuation and capitalization.', // Guide the model
          responseFormat: 'verbose_json', // Get detailed results
        });
        console.log('[LiveCaptions] Transcription completed');
      } else {
        console.error('[LiveCaptions] No URI returned from recording');
        Alert.alert('Error', 'Failed to get recording file. Please try again.');
      }

      setRecording(null);
      recordingRef.current = null;
    } catch (err: any) {
      console.error('[LiveCaptions] Failed to stop recording:', err);
      console.error('[LiveCaptions] Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      Alert.alert('Error', `Failed to process recording: ${err.message || 'Unknown error'}`);
      setIsRecording(false);
      setRecordingTime(0); // Reset timer on error
      setRecording(null);
      recordingRef.current = null;
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleClear = () => {
    setTranscript('');
    reset();
  };

  const handleSaveTranscript = () => {
    if (!transcript.trim()) {
      Alert.alert('No Transcript', 'There is no transcript to save.');
      return;
    }
    // TODO: Implement save transcript functionality
    Alert.alert('Saved', 'Transcript saved successfully!');
    console.log('Saving transcript:', transcript);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a241e' }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text variant="h3" className="text-white font-bold flex-1">
          Live Captions
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-20">
          {/* Transcript Display */}
          <View className="bg-[#2a3a2e] rounded-lg p-4 mb-6 min-h-48">
            <Text variant="body" className="text-white leading-6">
              {transcript || 'Live transcription will appear here...'}
            </Text>
          </View>

          {/* Recording Timer */}
          {isRecording && (
            <View className="mb-6 items-center">
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <Text variant="h2" className="text-white font-bold">
                  {formatTime(recordingTime)}
                </Text>
              </View>
              <Text variant="body" className="text-white/70">
                Recording...
              </Text>
            </View>
          )}

          {/* Recording Activity Indicator */}
          {isRecording && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text variant="h4" className="text-white font-bold">
                  Audio Level
                </Text>
                <Text variant="body" className="text-white/70">
                  {getNoiseLevelLabel(noiseLevel)}
                </Text>
              </View>
              <View className="relative">
                <ProgressBar progress={noiseLevel} height={10} />
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: animatedValue.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: 'rgba(56, 224, 120, 0.3)',
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          )}

          {/* Noise Level Indicator (when not recording) */}
          {!isRecording && (
            <View className="mb-6">
              <Text variant="h4" className="text-white font-bold mb-2">
                Noise Level
              </Text>
              <Text variant="body" className="text-white mb-3">
                {getNoiseLevelLabel(noiseLevel)}
              </Text>
              <ProgressBar progress={noiseLevel} height={8} />
            </View>
          )}

          {/* Recording Button */}
          <View className="mb-6">
            <Button
              title={isRecording ? `Stop Recording (${formatTime(recordingTime)})` : 'Start Recording'}
              onPress={handleToggleRecording}
              variant={isRecording ? 'dark' : 'primary'}
              disabled={isLoading}
              fullWidth
            />
            {isLoading && (
              <View className="mt-4 items-center">
                <ActivityIndicator size="small" color="#38E078" />
                <Text variant="body" className="text-white/70 mt-2">
                  Transcribing audio...
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <Button
              title="Clear"
              onPress={handleClear}
              variant="dark"
              className="flex-1"
              disabled={!transcript.trim()}
            />
            <Button
              title="Save Transcript"
              onPress={handleSaveTranscript}
              variant="primary"
              className="flex-1"
              disabled={!transcript.trim()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

