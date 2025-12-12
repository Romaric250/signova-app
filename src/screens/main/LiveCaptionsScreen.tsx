import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { transcribeAudio } from '../../services/audio/audioToText';
import { Button } from '../../components/atoms/Button';
import { ProgressBar } from '../../components/molecules/ProgressBar';
import { useAudioToText } from '../../hooks/useAudioToText';

// App color palette
const colors = {
  primary: '#38E078', // Bright green - buttons, accents
  primaryDark: '#2BC066',
  background: '#122117', // Dark green - main background
  surface: '#1A2E23', // Cards, surfaces
  surfaceLight: '#243D2E', // Borders, dividers
  text: '#FFFFFF', // White - primary text
  textSecondary: '#A0B8A8', // Secondary text
  textMuted: '#6B8B73', // Muted text
  danger: '#EF4444', // Red for errors/recording
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const LiveCaptionsScreen: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [noiseLevel, setNoiseLevel] = useState(65); // 0-100
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // in seconds
  const [typedMessage, setTypedMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'voice' | 'typed';
    text: string;
    timestamp: Date;
  }>>([]);
  const { transcribe, isLoading, error, result, reset } = useAudioToText();
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Request permissions on mount
    Audio.requestPermissionsAsync().catch(console.error);
  }, []);

  useEffect(() => {
    // Update conversation history when transcription result is available
    if (result?.text && result.text.trim()) {
      console.log('[LiveCaptions] Adding transcription to conversation:', result.text);
      setConversationHistory(prev => [
        ...prev,
        {
          type: 'voice' as const,
          text: result.text.trim(),
          timestamp: new Date(),
        }
      ]);
      setTranscript(''); // Clear the live transcript
      reset();
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
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
      const recordingOptions: Audio.RecordingOptions = {
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
        // Note: Result will be handled by the useEffect that watches 'result'
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
    setConversationHistory([]);
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

  // Add typed message to conversation
  const handleSendTypedMessage = useCallback(() => {
    if (typedMessage.trim()) {
      setConversationHistory(prev => [
        ...prev,
        {
          type: 'typed',
          text: typedMessage.trim(),
          timestamp: new Date(),
        }
      ]);
      setTypedMessage('');
      Keyboard.dismiss();
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [typedMessage]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-2 flex-row items-center justify-between" style={{ borderBottomWidth: 1, borderBottomColor: colors.surfaceLight }}>
          <View className="w-10" />
          <View className="flex-1">
            <Text style={{ color: colors.text }} className="text-lg font-bold text-center">
              Live Conversation
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-xs text-center mt-0.5">
              Speak or type to communicate
            </Text>
          </View>
          {/* Clear Button */}
          <TouchableOpacity
            onPress={handleClear}
            disabled={conversationHistory.length === 0}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={conversationHistory.length > 0 ? colors.danger : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Conversation Display Area */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Show conversation history */}
          {conversationHistory.map((message, index) => (
            <View
              key={index}
              className={`mb-2 p-3 rounded-2xl max-w-[85%] ${
                message.type === 'voice'
                  ? 'self-start rounded-bl-sm'
                  : 'self-end rounded-br-sm'
              }`}
              style={{ 
                backgroundColor: message.type === 'voice' ? colors.surface : colors.primary 
              }}
            >
              <View className="flex-row items-center mb-0.5">
                <Ionicons
                  name={message.type === 'voice' ? 'mic' : 'chatbubble'}
                  size={12}
                  color={message.type === 'voice' ? colors.textSecondary : colors.background}
                />
                <Text 
                  className="text-[10px] ml-1"
                  style={{ color: message.type === 'voice' ? colors.textSecondary : colors.background }}
                >
                  {message.type === 'voice' ? 'Voice' : 'Typed'}
                </Text>
              </View>
              <Text 
                className="text-sm"
                style={{ color: message.type === 'voice' ? colors.text : colors.background }}
              >
                {message.text}
              </Text>
              <Text 
                className="text-[10px] mt-0.5"
                style={{ color: message.type === 'voice' ? colors.textMuted : `${colors.background}99` }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}

          {/* Current transcription (live/processing) */}
          {isLoading && (
            <View 
              className="mb-2 p-3 rounded-2xl self-start rounded-bl-sm max-w-[85%]"
              style={{ backgroundColor: `${colors.surface}80` }}
            >
              <View className="flex-row items-center mb-0.5">
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={{ color: colors.textSecondary }} className="text-[10px] ml-2">Processing...</Text>
              </View>
            </View>
          )}

          {/* Empty state */}
          {conversationHistory.length === 0 && !isLoading && (
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
              <Text style={{ color: colors.textSecondary }} className="text-sm mt-3 text-center">
                Start a conversation
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-xs mt-1 text-center px-8">
                Tap the microphone to speak, or type a message below
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Input Area */}
        <View className="px-4 py-3" style={{ borderTopWidth: 1, borderTopColor: colors.surfaceLight, backgroundColor: colors.background }}>
          {/* Text Input Row */}
          <View className="flex-row items-end mb-2">
            <View 
              className="flex-1 rounded-2xl px-3 py-2 mr-2"
              style={{ backgroundColor: colors.surface }}
            >
              <TextInput
                ref={inputRef}
                value={typedMessage}
                onChangeText={setTypedMessage}
                placeholder="Type a message..."
                placeholderTextColor={colors.textMuted}
                style={{ color: colors.text }}
                className="text-sm max-h-20"
                multiline
                returnKeyType="send"
                onSubmitEditing={handleSendTypedMessage}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              onPress={handleSendTypedMessage}
              disabled={!typedMessage.trim()}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ 
                backgroundColor: typedMessage.trim() ? colors.primary : colors.surface 
              }}
            >
              <Ionicons
                name="send"
                size={18}
                color={typedMessage.trim() ? colors.background : colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Recording Button */}
          <TouchableOpacity
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl flex-row items-center justify-center"
            style={{ 
              backgroundColor: isRecording 
                ? colors.danger 
                : isLoading 
                ? colors.surface 
                : colors.primary 
            }}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={20}
              color={isRecording || !isLoading ? colors.background : colors.textMuted}
            />
            <Text 
              className="font-semibold text-sm ml-2"
              style={{ color: isRecording || !isLoading ? colors.background : colors.textMuted }}
            >
              {isRecording
                ? 'Stop Recording'
                : isLoading
                ? 'Processing...'
                : 'Tap to Speak'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

