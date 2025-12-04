import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { FormInput } from '@/components/molecules/FormInput';
import { Text } from '@/components/atoms/Text';
import { AuthStackParamList } from '@/types/navigation.types';
import { LoginCredentials } from '@/types/auth.types';
import { validateEmail } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (data: LoginCredentials) => {
    setLoginError(null); // Clear previous errors
    const result = await login(data);
    if (result.success) {
      // Navigation will happen automatically via AppNavigator when isAuthenticated becomes true
    } else {
      // Set error message to display
      setLoginError(result.error || 'Login failed. Please try again.');
    }
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
              Welcome Back
            </Text>
            <Text variant="body" className="text-gray-600">
              Sign in to continue learning
            </Text>
          </View>

          <View className="mb-6">
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

            <View className="mt-4">
              <FormInput
                name="password"
                control={control}
                label="Password"
                placeholder="Enter your password"
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
          </View>

          {loginError && (
            <View className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <Text variant="body" className="text-red-600 text-center">
                {loginError}
              </Text>
            </View>
          )}

          <Button
            title="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="ghost"
            className="self-end mb-6"
          />

          <Button
            title="Sign In"
            onPress={handleSubmit(handleLogin)}
            variant="primary"
            loading={isLoading}
            className="mb-4"
            fullWidth
          />

          <View className="flex-row justify-center items-center">
            <Text variant="body" className="text-gray-600">
              Don't have an account?{' '}
            </Text>
            <Button
              title="Sign Up"
              onPress={() => navigation.navigate('Signup')}
              variant="ghost"
              className="p-0"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

