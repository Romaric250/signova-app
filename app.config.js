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
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
      APP_ENV: process.env.APP_ENV || 'development',
      // Note: For production, use environment variables instead of hardcoding
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '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',
    },
  },
};

