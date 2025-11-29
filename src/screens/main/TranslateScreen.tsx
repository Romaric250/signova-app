import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { Slider } from '@/components/atoms/Slider';

type NavigationProp = NativeStackNavigationProp<any>;

export const TranslateScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const [speed, setSpeed] = useState(1); // 0.5x to 2x
  const [voice, setVoice] = useState('Neutral');

  const handleRecord = () => {
    // TODO: Implement recording
    console.log('Record pressed');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save pressed');
  };

  const getSpeedLabel = () => {
    return `${speed}x`;
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
          SignNova
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-20">
          {/* 3D Avatar Video Player */}
          <View className="bg-[#87CEEB] rounded-lg overflow-hidden mb-4" style={{ aspectRatio: 16 / 9 }}>
            <View className="w-full h-full items-center justify-center relative">
              {/* Placeholder for 3D avatar */}
              <View className="w-32 h-32 bg-white rounded-full items-center justify-center">
                <View className="w-24 h-24 bg-gray-200 rounded-full" />
              </View>
              {/* Play button overlay */}
              <TouchableOpacity
                className="absolute inset-0 items-center justify-center bg-black/20"
                activeOpacity={0.8}
              >
                <View className="bg-white/80 rounded-full w-16 h-16 items-center justify-center">
                  <Icon name="play" size={32} color="#1a241e" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Text Display */}
          <View className="mb-6">
            <Text variant="body" className="text-white">
              {text}
            </Text>
          </View>

          {/* Audio Control */}
          <View className="flex-row items-center mb-6">
            <Icon name="volume-high" size={24} color="#FFFFFF" />
            <Text variant="body" className="text-white ml-3">
              {voice}
            </Text>
          </View>

          {/* Speed Control */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-3">
              <Text variant="body" className="text-white">
                Speed
              </Text>
              <Text variant="body" className="text-white font-semibold">
                {getSpeedLabel()}
              </Text>
            </View>
            <Slider
              value={(speed - 0.5) / 1.5 * 100} // Convert 0.5-2 to 0-100
              onValueChange={(value) => {
                const newSpeed = 0.5 + (value / 100) * 1.5;
                setSpeed(Math.round(newSpeed * 2) / 2); // Round to 0.5 increments
              }}
              minimumValue={0}
              maximumValue={100}
              step={33.33} // Approximate steps for 0.5x, 1x, 1.5x, 2x
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <Button
              title="Record"
              onPress={handleRecord}
              variant="primary"
              className="flex-1"
            />
            <Button
              title="Save"
              onPress={handleSave}
              variant="outline"
              className="flex-1"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

