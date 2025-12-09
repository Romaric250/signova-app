import 'dotenv/config';

export default {
  expo: {
    name: 'SignNova',
    slug: 'signova-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#38E078',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.signnova.app',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#38E078',
      },
      package: 'com.signnova.app',
      versionCode: 1,
      compileSdkVersion: 35,
      targetSdkVersion: 34,
      minSdkVersion: 24,
      permissions: [
        'CAMERA',
        'RECORD_AUDIO',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
      ],
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission: 'Allow SignNova to access your camera for sign language recognition.',
        },
      ],
      [
        'expo-av',
        {
          microphonePermission: 'Allow SignNova to access your microphone for speech-to-sign translation.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '1a4fc6a3-1de2-405e-903c-581b8ad9b697',
      },
      // Live backend URL
      API_BASE_URL: process.env.API_BASE_URL || 'https://signova-backend.onrender.com/api',
      APP_ENV: process.env.APP_ENV || 'production',
      // OpenAI API Key - MUST be set in .env file (no hardcoded fallback)
      // This ensures the key is ONLY accessed via .env file
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    },
  },
};

