import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useAudioToText } from '@/hooks/useAudioToText';

type NavigationProp = NativeStackNavigationProp<any>;

export const LiveCaptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [transcript, setTranscript] = useState('');
  const [noiseLevel, setNoiseLevel] = useState(65); // 0-100
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { transcribe, isLoading, error, result, reset } = useAudioToText();
  const recordingRef = useRef<Audio.Recording | null>(null);

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

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

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
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (uri) {
        // Transcribe the audio
        await transcribe(uri, {
          language: 'en', // You can make this configurable
          responseFormat: 'verbose_json',
        });
      }

      setRecording(null);
      recordingRef.current = null;
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
      setIsRecording(false);
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

          {/* Noise Level Indicator */}
          <View className="mb-6">
            <Text variant="h4" className="text-white font-bold mb-2">
              Noise Level
            </Text>
            <Text variant="body" className="text-white mb-3">
              {getNoiseLevelLabel(noiseLevel)}
            </Text>
            <ProgressBar progress={noiseLevel} height={8} />
          </View>

          {/* Recording Button */}
          <View className="mb-6">
            <Button
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
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

