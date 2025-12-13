import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainNavigator } from './MainNavigator';
import { LiveCaptionsScreen } from '../screens/main/LiveCaptionsScreen';
import { SpeechToSignScreen } from '../screens/main/SpeechToSignScreen';

export type MainStackParamList = {
  MainTabs: undefined;
  LiveCaptions: undefined;
  SpeechToSign: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen name="LiveCaptions" component={LiveCaptionsScreen} />
      <Stack.Screen name="SpeechToSign" component={SpeechToSignScreen} />
    </Stack.Navigator>
  );
};