import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { FormInput } from '@/components/molecules/FormInput';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
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
    if (!result.success) {
      // TODO: Show error toast
      console.error('Signup error:', result.error);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a241e' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2"
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text variant="h4" className="text-white font-semibold">
            SignNova
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text variant="h1" className="text-white mb-2" style={{ fontSize: 32, fontWeight: '700' }}>
              Create Account
            </Text>
          </View>

          <View className="mb-6">
            <FormInput
              name="name"
              control={control}
              label=""
              placeholder="Name"
              variant="dark"
              className="mb-4"
              rules={{
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
            />

            <FormInput
              name="email"
              control={control}
              label=""
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              variant="dark"
              className="mb-4"
              rules={{
                required: 'Email is required',
                validate: (value) => validateEmail(value) || 'Invalid email format',
              }}
            />

            <FormInput
              name="password"
              control={control}
              label=""
              placeholder="Password"
              secureTextEntry
              variant="dark"
              className="mb-4"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
            />

            <FormInput
              name="confirmPassword"
              control={control}
              label=""
              placeholder="Select"
              variant="dark"
              rightIcon={
                <Icon name="chevron-up" size={20} color="#FFFFFF" />
              }
              className="mb-4"
              rules={{
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              }}
            />
          </View>

          <Button
            title="Sign Up"
            onPress={handleSubmit(handleSignup)}
            variant="primary"
            loading={isLoading}
            fullWidth
            size="large"
            className="mb-6"
          />

          <View className="items-center">
            <Text variant="body" className="text-white mb-2">
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text variant="body" className="text-white font-semibold">
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
