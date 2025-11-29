export default {
  expo: {
    name: 'SignNova',
    slug: 'signova-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
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
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
      APP_ENV: process.env.APP_ENV || 'development',
    },
  },
};

