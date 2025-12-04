import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TranslateStackParamList } from './types';
import { RealTimeModeSelectionScreen } from '../screens/main/RealTimeModeSelectionScreen';
import { TranslateScreen } from '../screens/main/TranslateScreen';
import { LiveCaptionsScreen } from '../screens/main/LiveCaptionsScreen';

const Stack = createNativeStackNavigator<TranslateStackParamList>();

export const TranslateNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="RealTimeModeSelection"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="RealTimeModeSelection"
        component={RealTimeModeSelectionScreen}
      />
      <Stack.Screen name="TextToSign" component={TranslateScreen} />
      <Stack.Screen name="LiveCaptions" component={LiveCaptionsScreen} />
    </Stack.Navigator>
  );
};

