import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['signnova://', 'https://signnova.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Onboarding: 'onboarding',
          Login: 'login',
          Signup: 'signup',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Dictionary: 'dictionary',
          Learning: 'learning',
          Translate: 'translate',
          Profile: 'profile',
        },
      },
    },
  },
};

