import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

// App color palette
const colors = {
  primary: '#38E078',
  primaryDark: '#2BC066',
  background: '#122117',
  surface: '#1A2E23',
  surfaceLight: '#243D2E',
  text: '#FFFFFF',
  textSecondary: '#A0B8A8',
  textMuted: '#6B8B73',
  danger: '#EF4444',
};

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    try {
      await signup({ name, email, password, confirmPassword });
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-xl items-center justify-center mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-6">
            <Text style={{ color: colors.text }} className="text-2xl font-bold">
              Create Account
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm mt-1">
              Start your sign language journey today
            </Text>
          </View>

          {/* Name Input */}
          <View className="mb-4">
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2 ml-1">
              Full Name
            </Text>
            <View 
              className="rounded-xl px-4 py-3 flex-row items-center"
              style={{ 
                backgroundColor: colors.surface,
                borderWidth: errors.name ? 1 : 0,
                borderColor: colors.danger,
              }}
            >
              <Ionicons name="person-outline" size={20} color={colors.textMuted} />
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textMuted}
                style={{ color: colors.text }}
                className="flex-1 ml-3 text-sm"
                autoCapitalize="words"
              />
            </View>
            {errors.name && (
              <Text style={{ color: colors.danger }} className="text-xs mt-1 ml-1">
                {errors.name}
              </Text>
            )}
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2 ml-1">
              Email
            </Text>
            <View 
              className="rounded-xl px-4 py-3 flex-row items-center"
              style={{ 
                backgroundColor: colors.surface,
                borderWidth: errors.email ? 1 : 0,
                borderColor: colors.danger,
              }}
            >
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                style={{ color: colors.text }}
                className="flex-1 ml-3 text-sm"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={{ color: colors.danger }} className="text-xs mt-1 ml-1">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2 ml-1">
              Password
            </Text>
            <View 
              className="rounded-xl px-4 py-3 flex-row items-center"
              style={{ 
                backgroundColor: colors.surface,
                borderWidth: errors.password ? 1 : 0,
                borderColor: colors.danger,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="Create a password"
                placeholderTextColor={colors.textMuted}
                style={{ color: colors.text }}
                className="flex-1 ml-3 text-sm"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={colors.textMuted} 
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={{ color: colors.danger }} className="text-xs mt-1 ml-1">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text style={{ color: colors.textSecondary }} className="text-sm mb-2 ml-1">
              Confirm Password
            </Text>
            <View 
              className="rounded-xl px-4 py-3 flex-row items-center"
              style={{ 
                backgroundColor: colors.surface,
                borderWidth: errors.confirmPassword ? 1 : 0,
                borderColor: colors.danger,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textMuted}
                style={{ color: colors.text }}
                className="flex-1 ml-3 text-sm"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={colors.textMuted} 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={{ color: colors.danger }} className="text-xs mt-1 ml-1">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={isLoading}
            className="py-4 rounded-xl items-center mb-4"
            style={{ backgroundColor: isLoading ? colors.surfaceLight : colors.primary }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={{ color: colors.background }} className="text-base font-semibold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={{ color: colors.textMuted }} className="text-xs text-center mb-6">
            By signing up, you agree to our{' '}
            <Text style={{ color: colors.primary }}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
          </Text>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px" style={{ backgroundColor: colors.surfaceLight }} />
            <Text style={{ color: colors.textMuted }} className="mx-4 text-xs">
              OR
            </Text>
            <View className="flex-1 h-px" style={{ backgroundColor: colors.surfaceLight }} />
          </View>

          {/* Social Sign Up */}
          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity 
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="logo-google" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-12 h-12 rounded-xl items-center justify-center ml-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="logo-apple" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center mt-8">
            <Text style={{ color: colors.textSecondary }} className="text-sm">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: colors.primary }} className="text-sm font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
