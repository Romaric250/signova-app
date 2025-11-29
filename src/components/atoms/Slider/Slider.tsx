import React from 'react';
import { View, TouchableOpacity, PanResponder, GestureResponderEvent } from 'react-native';

interface SliderProps {
  value: number; // 0-100
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  className = '',
}) => {
  const [sliderWidth, setSliderWidth] = React.useState(0);

  const getPercentage = () => {
    const range = maximumValue - minimumValue;
    return ((value - minimumValue) / range) * 100;
  };

  const handleLayout = (event: any) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const updateValue = (locationX: number) => {
    if (sliderWidth === 0) return;
    const percentage = Math.max(0, Math.min(100, (locationX / sliderWidth) * 100));
    const newValue = minimumValue + (percentage / 100) * (maximumValue - minimumValue);
    const steppedValue = Math.round(newValue / step) * step;
    onValueChange(Math.max(minimumValue, Math.min(maximumValue, steppedValue)));
  };

  const handlePress = (event: GestureResponderEvent) => {
    updateValue(event.nativeEvent.locationX);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event) => {
        updateValue(event.nativeEvent.locationX);
      },
    })
  ).current;

  const percentage = getPercentage();

  return (
    <View
      className={`relative ${className}`}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        className="relative"
      >
        <View className="h-1 bg-gray-600 rounded-full">
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </View>
        <View
          className="absolute top-1/2 w-4 h-4 bg-white rounded-full"
          style={{
            left: `${percentage}%`,
            marginLeft: -8,
            marginTop: -8,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

