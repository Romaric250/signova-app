import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { FormInput } from '@/components/molecules/FormInput';
import { Text } from '@/components/atoms/Text';
import { Header } from '@/components/organisms/Header';
import { AuthStackParamList } from '@/types/navigation.types';
import { validateEmail } from '@/utils/validation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    // TODO: Implement forgot password API call
    console.log('Forgot password:', data);
    // Show success message and navigate back
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Forgot Password"
        showBack
        onBackPress={() => navigation.goBack()}
      />
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
            <Text variant="body" className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
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
          </View>

          <Button
            title="Send Reset Link"
            onPress={handleSubmit(handleForgotPassword)}
            variant="primary"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

