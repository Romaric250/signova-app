import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { Icon } from '../../components/atoms/Icon';
import { Slider } from '../../components/atoms/Slider';

type NavigationProp = NativeStackNavigationProp<any>;

export const TranslateScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1); // 0.5x to 2x

  const handleTranslate = () => {
    // TODO: Implement translation
    console.log('Translate pressed');
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
          {/* Text Input Area */}
          <View className="bg-[#1a241e] rounded-lg mb-6 relative" style={{ minHeight: 200 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Enter text to translate..."
              placeholderTextColor="#9CA3AF"
              multiline
              className="text-white text-base p-4 min-h-[200px]"
              style={{ textAlignVertical: 'top' }}
            />
            <View className="absolute bottom-4 right-4">
              <Button
                title="Translate"
                onPress={handleTranslate}
                variant="primary"
                size="medium"
              />
            </View>
          </View>

          {/* Signing Output Section */}
          <View className="mb-6">
            <Text variant="h4" className="text-white font-bold mb-4">
              Signing Output
            </Text>
            <View className="bg-white rounded-lg overflow-hidden" style={{ aspectRatio: 16 / 9 }}>
              <View className="w-full h-full items-center justify-center">
                {/* Placeholder for 3D avatar */}
                <View className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center">
                  <Icon name="person" size={64} color="#9CA3AF" />
                </View>
              </View>
            </View>
          </View>

          {/* Speed Control */}
          <View className="mb-8">
            <Text variant="h4" className="text-white font-bold mb-4">
              Speed
            </Text>
            <View className="flex-row items-center justify-between mb-3">
              <Text variant="body" className="text-white">
                Adjust signing speed
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

