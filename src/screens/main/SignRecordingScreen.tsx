import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { Icon } from '../../components/atoms/Icon';

type NavigationProp = NativeStackNavigationProp<any>;

export const SignRecordingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text variant="body" className="text-white">
          Loading camera...
        </Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center px-6">
        <Text variant="h3" className="text-white font-bold text-center mb-4">
          Camera Permission Required
        </Text>
        <Text variant="body" className="text-white/80 text-center mb-8">
          We need access to your camera to record sign language.
        </Text>
        <Button
          title="Grant Permission"
          onPress={requestPermission}
          variant="primary"
          fullWidth
        />
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          className="mt-4"
          fullWidth
        />
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        await cameraRef.current.recordAsync({
          maxDuration: 60, // 60 seconds max
          quality: '720p',
        });
        // Recording started successfully
      } catch (error) {
        console.error('Error starting recording:', error);
        Alert.alert('Error', 'Failed to start recording');
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      try {
        const video = await cameraRef.current.stopRecording();
        setIsRecording(false);
        console.log('Video recorded:', video);
        // TODO: Process the video and convert to text/sign
        Alert.alert('Success', 'Video recorded successfully!');
      } catch (error) {
        console.error('Error stopping recording:', error);
        Alert.alert('Error', 'Failed to stop recording');
        setIsRecording(false);
      }
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-black/50 absolute top-0 left-0 right-0 z-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-black/50 rounded-full p-2"
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text variant="h4" className="text-white font-bold">
          Record Sign
        </Text>
        <TouchableOpacity
          onPress={toggleCameraFacing}
          className="bg-black/50 rounded-full p-2"
          activeOpacity={0.7}
        >
          <Icon name="camera-reverse" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="video"
      />

      {/* Recording Indicator */}
      {isRecording && (
        <View className="absolute top-20 left-0 right-0 items-center z-10">
          <View className="bg-red-500 rounded-full px-4 py-2 flex-row items-center">
            <View className="w-3 h-3 bg-white rounded-full mr-2" />
            <Text variant="small" className="text-white font-semibold">
              Recording...
            </Text>
          </View>
        </View>
      )}

      {/* Bottom Controls */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-6 py-8 items-center">
        <View className="flex-row items-center justify-center mb-6">
          <TouchableOpacity
            onPress={handleRecordPress}
            className={`
              w-20 h-20 rounded-full items-center justify-center
              ${isRecording ? 'bg-red-500' : 'bg-white'}
            `}
            activeOpacity={0.8}
          >
            {isRecording ? (
              <View className="w-8 h-8 bg-white rounded-sm" />
            ) : (
              <View className="w-12 h-12 bg-[#38E078] rounded-full" />
            )}
          </TouchableOpacity>
        </View>
        <Text variant="body" className="text-white text-center mb-4">
          {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

