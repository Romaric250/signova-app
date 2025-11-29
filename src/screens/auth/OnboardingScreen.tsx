import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
      type: 'microphone',
      title: 'Translate speech and text',
      subtitle: 'into sign language instantly',
    },
  ];

  const handleNext = async () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Last onboarding screen - navigate to Signup after completing all 3 screens
      const { setOnboardingCompleted } = await import('@/services/storage/localStorage');
      await setOnboardingCompleted(true);
      navigation.navigate('Signup');
    }
  };

  const handleGetStarted = () => {
    // Navigate to next onboarding screen (page 1) to go through all 3 screens
    setCurrentPage(1);
  };

  const handleLogin = async () => {
    // Mark onboarding as completed
    const { setOnboardingCompleted } = await import('@/services/storage/localStorage');
    await setOnboardingCompleted(true);
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

    if (page.type === 'microphone') {
      return (
        <View className="flex-1 px-6">
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
            {renderPageIndicator()}
          </View>
        </View>
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
