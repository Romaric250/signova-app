import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Dictionary: undefined;
  Learning: undefined;
  Translate: undefined;
  Profile: undefined;
};

export type DictionaryStackParamList = {
  DictionaryList: undefined;
  SignDetail: { signId: string };
  Category: { categoryId: string };
};

export type LearningStackParamList = {
  LearningHub: undefined;
  Lesson: { lessonId: string };
  Practice: { lessonId: string };
  Progress: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  ProfileEdit: undefined;
  Accessibility: undefined;
  AvatarCustomization: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

