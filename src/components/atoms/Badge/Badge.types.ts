import { ViewProps } from 'react-native';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  className?: string;
}

