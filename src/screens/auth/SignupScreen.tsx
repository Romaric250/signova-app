import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { FormInput } from '@/components/molecules/FormInput';
import { Text } from '@/components/atoms/Text';
import { useAuth } from '@/hooks/useAuth';
import { AuthStackParamList } from '@/types/navigation.types';
import { SignupData } from '@/types/auth.types';
import { validateEmail } from '@/utils/validation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signup, isLoading } = useAuth();
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignupData>();

  const password = watch('password');

  const handleSignup = async (data: SignupData) => {
    const result = await signup(data);
    if (result.success) {
      navigation.navigate('SignLanguageSelection');
    } else {
      // TODO: Show error toast
      console.error('Signup error:', result.error);
    }
  };

  const handleBypass = () => {
    // Bypass authentication for development - directly navigate to sign language selection
    navigation.navigate('SignLanguageSelection');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text variant="h1" className="text-gray-900 mb-2">
              Create Account
            </Text>
            <Text variant="body" className="text-gray-600">
              Join SignNova and start learning
            </Text>
          </View>

          <View className="mb-6">
            <FormInput
              name="name"
              control={control}
              label="Full Name"
              placeholder="Enter your full name"
              rules={{
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
            />

            <View className="mt-4">
              <FormInput
                name="email"
                control={control}
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                rules={{
                  required: 'Email is required',
                  validate: (value) => validateEmail(value) || 'Invalid email format',
                }}
              />
            </View>

            <View className="mt-4">
              <FormInput
                name="password"
                control={control}
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
              />
            </View>

            <View className="mt-4">
              <FormInput
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                placeholder="Confirm your password"
                secureTextEntry
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                }}
              />
            </View>
          </View>

          <Button
            title="Sign Up"
            onPress={handleBypass}
            variant="primary"
            loading={isLoading}
            className="mb-4"
            fullWidth
          />

          <View className="flex-row justify-center items-center">
            <Text variant="body" className="text-gray-600">
              Already have an account?{' '}
            </Text>
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              className="p-0"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
