import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { AuthStackParamList } from '../../types/navigation.types.ts';
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

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentPage, setCurrentPage] = useState(0);

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
      type: 'book',
      title: 'Build real skills with',
      subtitle: 'lessons, quizzes, and practice.',
      topBgColor: '#e8e9e0',
    },
  ];

  const handleNext = async () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Last onboarding screen - navigate to Signup after completing all 3 screens
      const { setOnboardingCompleted } = await import('../../services/storage/localStorage');
      await setOnboardingCompleted(true);
      // Small delay to ensure storage is persisted before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      navigation.navigate('Signup');
    }
  };

  const handleGetStarted = () => {
    // Navigate to next onboarding screen (page 1) to go through all 3 screens
    setCurrentPage(1);
  };

  const handleLogin = async () => {
    // Mark onboarding as completed
    const { setOnboardingCompleted } = await import('../../services/storage/localStorage');
    await setOnboardingCompleted(true);
    // Small delay to ensure storage is persisted before navigation
    await new Promise(resolve => setTimeout(resolve, 100));
    navigation.navigate('Login');
  };

  const renderPageIndicator = () => {
    return (
      <View className="flex-row items-center justify-center mb-6">
        {pages.map((_, index) => (
          <View
            key={index}
            className={`
              rounded-full mx-1.5
              ${index === currentPage ? 'bg-primary w-2.5 h-2.5' : 'bg-[#2a3a2e] w-2 h-2'}
            `}
          />
        ))}
      </View>
    );
  };

  const renderContent = () => {
    const page = pages[currentPage];

    if (page.type === 'welcome') {
      return (
        <View className="flex-1 items-center justify-center px-6">
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
        </View>
      );
    }

    if (page.type === 'eye') {
      return (
        <>
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
            {renderPageIndicator()}
          </View>
        </>
      );
    }

    if (page.type === 'book') {
      return (
        <>
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
            {renderPageIndicator()}
          </View>
        </>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#1a241e' }}>
      {currentPage === 0 ? (
        // Welcome Screen (Screen 1)
        <View className="flex-1">
          {renderContent()}
          <View className="px-6 pb-8">
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
        </View>
      ) : (
        // Other Onboarding Screens
        <View className="flex-1">
          {renderContent()}
          <View className="px-6 pb-8">
            <Button
              title={currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
              onPress={handleNext}
              variant="primary"
              fullWidth
              size="large"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
