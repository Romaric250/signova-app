import { ViewProps } from 'react-native';

export interface AvatarProps extends ViewProps {
  source?: { uri: string };
  name?: string;
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
}

