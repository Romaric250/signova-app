import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { ProgressBar } from '@/components/molecules/ProgressBar';

type NavigationProp = NativeStackNavigationProp<any>;

export const LiveCaptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [transcript, setTranscript] = useState(
    'The quick brown fox jumps over the lazy dog. This is a test sentence to demonstrate the live captioning feature. The system should accurately transcribe spoken words into text in real-time.'
  );
  const [noiseLevel, setNoiseLevel] = useState(65); // 0-100

  const getNoiseLevelLabel = (level: number) => {
    if (level < 30) return 'Low';
    if (level < 70) return 'Moderate';
    return 'High';
  };

  const handleClear = () => {
    setTranscript('');
  };

  const handleSaveTranscript = () => {
    // TODO: Implement save transcript functionality
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

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <Button
              title="Clear"
              onPress={handleClear}
              variant="dark"
              className="flex-1"
            />
            <Button
              title="Save Transcript"
              onPress={handleSaveTranscript}
              variant="primary"
              className="flex-1"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

