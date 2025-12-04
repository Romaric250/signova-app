import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
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

  // Force boolean conversion for TextInput props
  const editable = props.editable !== undefined 
    ? (props.editable === true || props.editable === 'true')
    : undefined;
  const secureTextEntry = props.secureTextEntry !== undefined
    ? (props.secureTextEntry === true || props.secureTextEntry === 'true')
    : undefined;
  const multiline = props.multiline !== undefined
    ? (props.multiline === true || props.multiline === 'true')
    : undefined;
  const autoFocus = props.autoFocus !== undefined
    ? (props.autoFocus === true || props.autoFocus === 'true')
    : undefined;

  // Remove boolean props from spread to avoid passing strings
  const { editable: _, secureTextEntry: __, multiline: ___, autoFocus: ____, ...textInputProps } = props;

  const containerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: error ? '#EF4444' : (isDark ? '#2a3a2e' : '#D1D5DB'),
    backgroundColor: editable === false 
      ? (isDark ? '#1a241e' : '#F3F4F6') 
      : (isDark ? '#2a3a2e' : '#FFFFFF'),
  };

  return (
    <View className={containerClassName}>
      {label && (
        <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
          {label}
        </Text>
      )}
      <View style={containerStyle}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: isDark ? '#FFFFFF' : '#111827',
          }}
          placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
          editable={editable}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          autoFocus={autoFocus}
          {...textInputProps}
        />
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
};
