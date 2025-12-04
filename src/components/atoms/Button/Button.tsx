import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  ...props
}) => {
  // Force boolean conversion - never trust the input
  const isDisabled = disabled === true || disabled === 'true';
  const isLoading = loading === true || loading === 'true';
  const isFullWidth = fullWidth === true || fullWidth === 'true';

  // Get styles based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#38E078' };
      case 'secondary':
        return { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#38E078' };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: '#EF4444' };
      case 'dark':
        return { backgroundColor: '#2a3a2e' };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#FFFFFF' };
      default:
        return { backgroundColor: '#38E078' };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#000000';
      case 'danger':
      case 'dark':
        return '#FFFFFF';
      case 'secondary':
        return '#38E078';
      case 'ghost':
        return '#38E078';
      case 'outline':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 16, paddingVertical: 8 };
      case 'large':
        return { paddingHorizontal: 32, paddingVertical: 16 };
      default:
        return { paddingHorizontal: 24, paddingVertical: 12 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  // Filter out any boolean props from spread
  const safeProps = Object.keys(props).reduce((acc, key) => {
    const value = props[key as keyof typeof props];
    // Skip className and any boolean-like props
    if (key === 'className' || key === 'disabled' || key === 'loading' || key === 'fullWidth') {
      return acc;
    }
    // Convert string booleans to actual booleans
    if (typeof value === 'string' && (value === 'true' || value === 'false')) {
      acc[key] = value === 'true';
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  const containerStyle = [
    {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: (isDisabled || isLoading) ? 0.5 : 1,
      width: isFullWidth ? '100%' : undefined,
    },
    getVariantStyle(),
    getSizeStyle(),
  ];

  return (
    <View className={className} style={isFullWidth ? { width: '100%' } : undefined}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled || isLoading}
        style={containerStyle}
        activeOpacity={0.7}
        {...safeProps}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#38E078'}
          />
        ) : (
          <>
            {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
            <Text
              style={{
                fontWeight: '600',
                color: getTextColor(),
                fontSize: getTextSize(),
              }}
            >
              {title}
            </Text>
            {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
