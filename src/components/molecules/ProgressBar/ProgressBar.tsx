import React from 'react';
import { View } from 'react-native';
import { Text } from '../../atoms/Text';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = false,
  className = '',
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View className={className}>
      {showLabel && (
        <View className="flex-row justify-between mb-2">
          <Text variant="small" className="text-gray-600">
            Progress
          </Text>
          <Text variant="small" className="text-gray-600">
            {Math.round(clampedProgress)}%
          </Text>
        </View>
      )}
      <View
        className="bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <View
          className="bg-primary h-full rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </View>
    </View>
  );
};

