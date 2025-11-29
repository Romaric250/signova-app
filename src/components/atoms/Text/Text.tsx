import React from 'react';
import { Text as RNText } from 'react-native';
import { TextProps } from './Text.types';
import { typography } from '@/config/theme';

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  className = '',
  style,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return typography.h1;
      case 'h2':
        return typography.h2;
      case 'h3':
        return typography.h3;
      case 'h4':
        return typography.h4;
      case 'body':
        return typography.body;
      case 'small':
        return typography.small;
      case 'caption':
        return typography.caption;
      default:
        return typography.body;
    }
  };

  return (
    <RNText
      style={[getVariantStyle(), style]}
      className={className}
      {...props}
    />
  );
};

