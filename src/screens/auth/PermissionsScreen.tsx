import React from 'react';
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { AuthStackParamList } from '@/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { mockUser } from '@/utils/mockData';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface PermissionItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const permissions: PermissionItem[] = [
  {
    id: 'microphone',
    icon: 'mic',
    title: 'Microphone Access',
    description: 'For speech recognition and interactive lessons.',
  },
  {
    id: 'camera',
    icon: 'camera',
    title: 'Camera Access',
    description: 'For gesture practice and interactive lessons.',
  },
  {
    id: 'storage',
    icon: 'folder',
    title: 'Storage Access',
    description: 'To download and store offline lesson packs.',
  },
];

export const PermissionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const login = useAuthStore((state) => state.login);

  const handleAllowAccess = async () => {
    // TODO: Request actual permissions
    console.log('Requesting permissions...');
    
    // Bypass: Login and navigate to main app
    await login(mockUser, 'mock-token');
    // Navigation will happen automatically via AppNavigator when isAuthenticated becomes true
  };

  const handleClose = () => {
    // Bypass: Login and navigate to main app
    handleAllowAccess();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-[#2a3a2e] rounded-2xl p-6 w-full max-w-md">
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-4 right-4 z-10"
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* App Name */}
          <Text variant="h3" className="text-white font-bold text-center mb-6 mt-4">
            SignNova
          </Text>

          {/* Title */}
          <Text variant="h2" className="text-white font-bold text-center mb-4">
            Unlock the Full SignNova Experience
          </Text>

          {/* Description */}
          <Text variant="body" className="text-white/80 text-center mb-8">
            To fully utilize SignNova's features, we need access to your microphone, camera, and storage. This allows for speech recognition, gesture practice, and offline pack downloads.
          </Text>

          {/* Permission Items */}
          <View className="space-y-4 mb-8">
            {permissions.map((permission) => (
              <View key={permission.id} className="flex-row items-start">
                <View className="bg-[#38E078] rounded-lg w-12 h-12 items-center justify-center mr-4">
                  <Icon name={permission.icon} size={24} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text variant="h4" className="text-white font-bold mb-1">
                    {permission.title}
                  </Text>
                  <Text variant="small" className="text-white/80">
                    {permission.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Allow Access Button */}
          <Button
            title="Allow Access"
            onPress={handleAllowAccess}
            variant="primary"
            fullWidth
            size="large"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

