import React, { useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

export const TranslateScreen: React.FC = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleTranslate = () => {
    // TODO: Implement translation
    console.log('Translate:', text);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implement recording
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Translate" />

      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          <Card>
            <Text variant="h4" className="mb-4">
              Text to Sign
            </Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Enter text to translate..."
              multiline
              className="border-2 border-gray-300 rounded-lg p-4 min-h-32 text-base"
              placeholderTextColor="#9CA3AF"
            />
            <View className="flex-row space-x-2 mt-4">
              <Button
                title="Translate"
                onPress={handleTranslate}
                variant="primary"
                className="flex-1"
              />
              <Button
                title={isRecording ? 'Stop' : 'Record'}
                onPress={handleRecord}
                variant={isRecording ? 'danger' : 'secondary'}
                leftIcon={
                  <Icon
                    name={isRecording ? 'stop' : 'mic'}
                    size={20}
                    color={isRecording ? '#FFFFFF' : '#38E078'}
                  />
                }
              />
            </View>
          </Card>

          <Card>
            <Text variant="h4" className="mb-4">
              Translation
            </Text>
            <View className="items-center justify-center py-12 bg-gray-50 rounded-lg">
              <Icon name="videocam" size={48} color="#9CA3AF" />
              <Text variant="body" className="text-gray-500 mt-4">
                3D Avatar will appear here
              </Text>
            </View>
          </Card>

          <Card>
            <Text variant="h4" className="mb-4">
              Recent Translations
            </Text>
            <View className="items-center justify-center py-8">
              <Text variant="body" className="text-gray-500">
                No recent translations
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

