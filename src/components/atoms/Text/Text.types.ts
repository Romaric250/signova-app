import { TextProps as RNTextProps } from 'react-native';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

