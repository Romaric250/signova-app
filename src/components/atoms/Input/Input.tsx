import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  variant = 'light',
  ...props
}) => {
  const isDark = variant === 'dark';

  return (
    <View className={containerClassName}>
      {label && (
        <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center
          border-2 rounded-lg px-4 py-3
          ${error ? 'border-red-500' : isDark ? 'border-[#2a3a2e]' : 'border-gray-300'}
          ${props.editable === false 
            ? (isDark ? 'bg-[#1a241e]' : 'bg-gray-100') 
            : (isDark ? 'bg-[#2a3a2e]' : 'bg-white')
          }
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          className={`
            flex-1 text-base
            ${isDark ? 'text-white' : 'text-gray-900'}
            ${className}
          `}
          placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
};

