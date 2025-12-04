import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '../../components/atoms/Text';
import { Icon } from '../../components/atoms/Icon';

type NavigationProp = NativeStackNavigationProp<any>;

interface WorkflowOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

const workflowOptions: WorkflowOption[] = [
  {
    id: 'speech-to-sign',
    title: 'Speech → Sign',
    description: 'Convert spoken words into sign language in real-time.',
    icon: 'mic',
    route: 'TextToSign',
  },
  {
    id: 'text-to-sign',
    title: 'Text → Sign',
    description: 'Translate text into sign language animations instantly.',
    icon: 'document-text-outline',
    route: 'TextToSign',
  },
  {
    id: 'live-captioning',
    title: 'Live Captioning Only',
    description: 'Generate live captions from spoken language for accessibility.',
    icon: 'closed-captioning-outline',
    route: 'LiveCaptions',
  },
  {
    id: 'sign-to-text',
    title: 'Record Sign → Text/Sign',
    description: 'Record sign language and convert to text or sign animations.',
    icon: 'videocam',
    route: 'SignRecording',
  },
];

export const RealTimeModeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleWorkflowPress = (option: WorkflowOption) => {
    navigation.navigate(option.route as never);
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
          Real-Time Mode Selection
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-20">
          <Text variant="h2" className="text-white font-bold text-center mb-8 mt-4">
            Choose Your Workflow
          </Text>

          {workflowOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleWorkflowPress(option)}
              className="bg-[#2a3a2e] rounded-lg p-4 mb-4 flex-row items-center"
              activeOpacity={0.8}
            >
              <View className="bg-[#38E078] rounded-lg w-12 h-12 items-center justify-center mr-4">
                <Icon name={option.icon} size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text variant="h4" className="text-white font-bold mb-1">
                  {option.title}
                </Text>
                <Text variant="small" className="text-white/80">
                  {option.description}
                </Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

