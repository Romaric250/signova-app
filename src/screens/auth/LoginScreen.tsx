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

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login({ email, password });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl items-center justify-center mb-4" style={{ backgroundColor: colors.primary }}>
              <Ionicons name="hand-left" size={32} color={colors.background} />
            </View>
            <Text style={{ color: colors.text }} className="text-2xl font-bold">
              Welcome Back
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm mt-1">
              Sign in to continue learning
            </Text>
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
          <View className="mb-6">
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
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <TouchableOpacity className="self-end mb-6">
            <Text style={{ color: colors.primary }} className="text-sm">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="py-4 rounded-xl items-center mb-4"
            style={{ backgroundColor: isLoading ? colors.surfaceLight : colors.primary }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={{ color: colors.background }} className="text-base font-semibold">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px" style={{ backgroundColor: colors.surfaceLight }} />
            <Text style={{ color: colors.textMuted }} className="mx-4 text-xs">
              OR
            </Text>
            <View className="flex-1 h-px" style={{ backgroundColor: colors.surfaceLight }} />
          </View>

          {/* Social Login */}
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

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-8">
            <Text style={{ color: colors.textSecondary }} className="text-sm">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ color: colors.primary }} className="text-sm font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

