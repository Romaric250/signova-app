import React, { useState, useRef } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { AuthStackParamList } from '@/types/navigation.types';
import Svg, { Path, Circle } from 'react-native-svg';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const { width, height } = Dimensions.get('window');

// Eye Icon Component
const EyeIcon: React.FC<{ size?: number }> = ({ size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Path
        d="M60 20C35 20 15 40 10 60C15 80 35 100 60 100C85 100 105 80 110 60C105 40 85 20 60 20Z"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />
      <Circle cx="60" cy="60" r="15" stroke="white" strokeWidth="3" fill="none" />
      <Circle cx="60" cy="60" r="8" fill="white" />
    </Svg>
  );
};

// Book with Flame Icon Component
const BookFlameIcon: React.FC<{ size?: number }> = ({ size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Flame */}
      <Path
        d="M50 30C50 30 45 40 45 50C45 55 47 58 50 60C53 58 55 55 55 50C55 40 50 30 50 30Z"
        stroke="#1a241e"
        strokeWidth="2"
        fill="none"
      />
      {/* Book */}
      <Path
        d="M30 40L30 90L60 85L90 90L90 40L60 35L30 40Z"
        stroke="#1a241e"
        strokeWidth="2"
        fill="none"
      />
      <Path d="M60 35L60 85" stroke="#1a241e" strokeWidth="2" />
      <Path d="M45 50L45 75" stroke="#1a241e" strokeWidth="1.5" />
      <Path d="M75 50L75 75" stroke="#1a241e" strokeWidth="1.5" />
    </Svg>
  );
};

// Microphone Icon Component
const MicrophoneIcon: React.FC<{ size?: number }> = ({ size = 200 }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.6,
          height: size * 0.8,
          backgroundColor: '#E5E7EB',
          borderRadius: size * 0.3,
          borderWidth: 2,
          borderColor: '#9CA3AF',
        }}
      />
      <View
        style={{
          width: size * 0.15,
          height: size * 0.4,
          backgroundColor: '#374151',
          marginTop: -size * 0.2,
        }}
      />
      <View
        style={{
          width: size * 0.4,
          height: size * 0.1,
          backgroundColor: '#374151',
          marginTop: -size * 0.05,
          borderRadius: size * 0.05,
        }}
      />
    </View>
  );
};

interface OnboardingPageProps {
  page: typeof pages[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ page, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [width * 0.3, 0, -width * 0.3],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  if (page.type === 'welcome') {
    return (
      <Animated.View
        style={[
          {
            width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          },
          animatedStyle,
        ]}
      >
        <Text
          variant="h1"
          className="text-white text-center mb-6"
          style={{ fontSize: 42, fontWeight: '700' }}
        >
          {page.title}
        </Text>
        <Text
          className="text-white text-center mb-16"
          style={{ fontSize: 24, fontWeight: '700', lineHeight: 32 }}
        >
          {page.subtitle}
        </Text>
      </Animated.View>
    );
  }

  if (page.type === 'eye') {
    return (
      <Animated.View
        style={[
          {
            width,
            flex: 1,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            height: height * 0.4,
            backgroundColor: page.topBgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EyeIcon size={120} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#1a241e',
            paddingHorizontal: 24,
            paddingTop: 40,
          }}
        >
          <Text
            className="text-white text-center mb-2"
            style={{ fontSize: 24, fontWeight: '600', lineHeight: 32 }}
          >
            {page.title}
          </Text>
          <Text
            className="text-white text-center mb-2"
            style={{ fontSize: 24, fontWeight: '600', lineHeight: 32 }}
          >
            {page.subtitle}
          </Text>
          <Text
            className="text-white text-center"
            style={{ fontSize: 24, fontWeight: '600', lineHeight: 32 }}
          >
            {page.thirdLine}
          </Text>
        </View>
      </Animated.View>
    );
  }

  if (page.type === 'microphone') {
    return (
      <Animated.View
        style={[
          {
            width,
            flex: 1,
            paddingHorizontal: 24,
          },
          animatedStyle,
        ]}
      >
        <View className="flex-1 items-center justify-center">
          <View
            style={{
              width: width * 0.7,
              height: height * 0.35,
              backgroundColor: '#4FD1C7',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <MicrophoneIcon size={180} />
          </View>
          <Text
            className="text-white text-center mb-8"
            style={{ fontSize: 22, fontWeight: '600', lineHeight: 30, paddingHorizontal: 20 }}
          >
            {page.title} {page.subtitle}
          </Text>
        </View>
      </Animated.View>
    );
  }

  if (page.type === 'book') {
    return (
      <Animated.View
        style={[
          {
            width,
            flex: 1,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            height: height * 0.4,
            backgroundColor: page.topBgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookFlameIcon size={120} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#1a241e',
            paddingHorizontal: 24,
            paddingTop: 40,
          }}
        >
          <Text
            className="text-white text-center mb-2"
            style={{ fontSize: 22, fontWeight: '700', lineHeight: 30 }}
          >
            {page.title}
          </Text>
          <Text
            className="text-white text-center"
            style={{ fontSize: 22, fontWeight: '700', lineHeight: 30 }}
          >
            {page.subtitle}
          </Text>
        </View>
      </Animated.View>
    );
  }

  return null;
};

const pages = [
  {
    type: 'welcome',
    title: 'SignNova',
    subtitle: 'Understand communication beyond sound.',
  },
  {
    type: 'eye',
    title: 'Learn visually, the way',
    subtitle: 'Deaf communities',
    thirdLine: 'communicate.',
    topBgColor: '#e8e9e0',
  },
  {
    type: 'microphone',
    title: 'Translate speech and text',
    subtitle: 'into sign language instantly',
  },
  {
    type: 'book',
    title: 'Build real skills with',
    subtitle: 'lessons, quizzes, and practice.',
    topBgColor: '#e8e9e0',
  },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleNext = async () => {
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      flatListRef.current?.scrollToIndex({ index: nextPage, animated: true });
      setCurrentPage(nextPage);
    } else {
      // Mark onboarding as completed
      const { setOnboardingCompleted } = await import('@/services/storage/localStorage');
      await setOnboardingCompleted(true);
      navigation.navigate('Login');
    }
  };

  const handleGetStarted = async () => {
    // Mark onboarding as completed
    const { setOnboardingCompleted } = await import('@/services/storage/localStorage');
    await setOnboardingCompleted(true);
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    // Mark onboarding as completed
    const { setOnboardingCompleted } = await import('@/services/storage/localStorage');
    await setOnboardingCompleted(true);
    navigation.navigate('Login');
  };


  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== undefined) {
        setCurrentPage(index);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderPageIndicator = () => {
    return (
      <View className="flex-row items-center justify-center mb-6">
        {pages.map((_, index) => (
          <Animated.View
            key={index}
            style={useAnimatedStyle(() => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              const scale = interpolate(
                scrollX.value,
                inputRange,
                [0.8, 1.2, 0.8],
                Extrapolate.CLAMP
              );

              const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.5, 1, 0.5],
                Extrapolate.CLAMP
              );

              return {
                transform: [{ scale }],
                opacity,
              };
            })}
          >
            <View
              className={`
                rounded-full mx-1.5
                ${index === currentPage ? 'bg-primary w-2.5 h-2.5' : 'bg-[#2a3a2e] w-2 h-2'}
              `}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a241e' }}>
      <View className="flex-1">
        <Animated.FlatList
          ref={flatListRef}
          data={pages}
          renderItem={({ item, index }) => (
            <OnboardingPage page={item} index={index} scrollX={scrollX} />
          )}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          bounces={false}
          decelerationRate="fast"
        />

        {currentPage === 0 ? (
          // Welcome Screen (Screen 1)
          <View className="px-6 pb-8" style={{ backgroundColor: '#1a241e' }}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              className="mb-4"
              fullWidth
              size="large"
            />
            <Button
              title="Log In"
              onPress={handleLogin}
              variant="dark"
              fullWidth
              size="large"
            />
          </View>
        ) : (
          // Other Onboarding Screens
          <View className="px-6 pb-8" style={{ backgroundColor: '#1a241e' }}>
            {renderPageIndicator()}
            <Button
              title={currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
              onPress={handleNext}
              variant="primary"
              fullWidth
              size="large"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
