import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Easing,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// App color palette
const colors = {
  primary: '#38E078',
  primaryDark: '#2BC066',
  background: '#122117',
  surface: '#1A2E23',
  surfaceLight: '#243D2E',
  text: '#FFFFFF',
  textSecondary: '#A0B8A8',
  textMuted: '#6B8B73',
  danger: '#EF4444',
  warning: '#F59E0B',
  purple: '#8B5CF6',
  blue: '#3B82F6',
};

// Demo signs that the avatar can display
const demoSigns = [
  { word: 'Hello', duration: 2000 },
  { word: 'Thank You', duration: 2500 },
  { word: 'Please', duration: 2000 },
  { word: 'Yes', duration: 1500 },
  { word: 'No', duration: 1500 },
  { word: 'Help', duration: 2000 },
  { word: 'Sorry', duration: 2000 },
  { word: 'Goodbye', duration: 2000 },
];

export const SpeechToSignScreen: React.FC = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSign, setCurrentSign] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  
  // Animation values for avatar
  const avatarScale = useRef(new Animated.Value(1)).current;
  const avatarRotate = useRef(new Animated.Value(0)).current;
  const handLeftY = useRef(new Animated.Value(0)).current;
  const handRightY = useRef(new Animated.Value(0)).current;
  const handLeftX = useRef(new Animated.Value(0)).current;
  const handRightX = useRef(new Animated.Value(0)).current;
  const bodyY = useRef(new Animated.Value(0)).current;

  // Animate avatar when signing
  const animateSign = (signWord: string) => {
    setCurrentSign(signWord);
    setIsAnimating(true);

    // Reset positions
    handLeftY.setValue(0);
    handRightY.setValue(0);
    handLeftX.setValue(0);
    handRightX.setValue(0);
    bodyY.setValue(0);

    // Different animations for different signs
    const animations = {
      'Hello': () => {
        Animated.sequence([
          Animated.timing(handRightY, { toValue: -30, duration: 300, useNativeDriver: true }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(handRightX, { toValue: 15, duration: 200, useNativeDriver: true }),
              Animated.timing(handRightX, { toValue: -15, duration: 200, useNativeDriver: true }),
            ]),
            { iterations: 3 }
          ),
          Animated.timing(handRightY, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setIsAnimating(false));
      },
      'Thank You': () => {
        Animated.sequence([
          Animated.timing(handRightY, { toValue: -50, duration: 300, useNativeDriver: true }),
          Animated.timing(handRightY, { toValue: -20, duration: 400, useNativeDriver: true }),
          Animated.timing(bodyY, { toValue: 5, duration: 200, useNativeDriver: true }),
          Animated.timing(bodyY, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(handRightY, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setIsAnimating(false));
      },
      'Yes': () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bodyY, { toValue: 8, duration: 200, useNativeDriver: true }),
            Animated.timing(bodyY, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]),
          { iterations: 3 }
        ).start(() => setIsAnimating(false));
      },
      'No': () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(avatarRotate, { toValue: 0.05, duration: 150, useNativeDriver: true }),
            Animated.timing(avatarRotate, { toValue: -0.05, duration: 150, useNativeDriver: true }),
          ]),
          { iterations: 3 }
        ).start(() => {
          avatarRotate.setValue(0);
          setIsAnimating(false);
        });
      },
      'default': () => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(handLeftY, { toValue: -40, duration: 400, useNativeDriver: true }),
            Animated.timing(handRightY, { toValue: -40, duration: 400, useNativeDriver: true }),
          ]),
          Animated.delay(500),
          Animated.parallel([
            Animated.timing(handLeftY, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(handRightY, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
        ]).start(() => setIsAnimating(false));
      },
    };

    const animation = animations[signWord as keyof typeof animations] || animations['default'];
    animation();
  };

  // Handle text to sign conversion
  const handleConvert = () => {
    if (!inputText.trim()) {
      Alert.alert('Enter Text', 'Please enter some text to convert to sign language.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      const words = inputText.trim().split(' ');
      // Find a matching demo sign or use the first word
      const matchingSign = demoSigns.find(s => 
        s.word.toLowerCase() === words[0].toLowerCase()
      );
      animateSign(matchingSign?.word || words[0]);
    }, 1000);
  };

  // Run demo sequence
  const runDemo = () => {
    setShowDemo(true);
    setDemoIndex(0);
  };

  useEffect(() => {
    if (showDemo && demoIndex < demoSigns.length) {
      animateSign(demoSigns[demoIndex].word);
      
      const timer = setTimeout(() => {
        setDemoIndex(prev => prev + 1);
      }, demoSigns[demoIndex].duration + 500);

      return () => clearTimeout(timer);
    } else if (showDemo && demoIndex >= demoSigns.length) {
      setShowDemo(false);
      setDemoIndex(0);
      setCurrentSign(null);
    }
  }, [showDemo, demoIndex]);

  const rotateInterpolate = avatarRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-30deg', '30deg'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center" style={{ borderBottomWidth: 1, borderBottomColor: colors.surfaceLight }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ color: colors.text }} className="text-lg font-bold">
            Speech to Sign
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-xs">
            Convert text to sign language
          </Text>
        </View>
        <TouchableOpacity 
          onPress={runDemo}
          disabled={showDemo || isAnimating}
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: showDemo ? colors.surfaceLight : `${colors.primary}20` }}
        >
          <Text style={{ color: showDemo ? colors.textMuted : colors.primary }} className="text-xs font-semibold">
            {showDemo ? 'Playing...' : 'Demo'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* 3D Avatar Display Area */}
        <View className="mx-4 mt-4 rounded-2xl overflow-hidden" style={{ backgroundColor: colors.surface }}>
          <LinearGradient
            colors={[colors.surfaceLight, colors.surface]}
            className="items-center justify-center py-8"
            style={{ minHeight: 280 }}
          >
            {/* Avatar Placeholder */}
            <Animated.View
              style={{
                transform: [
                  { translateY: bodyY },
                  { rotate: rotateInterpolate },
                  { scale: avatarScale },
                ],
              }}
            >
              {/* Avatar Body */}
              <View className="items-center">
                {/* Head */}
                <View 
                  className="w-20 h-20 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  {/* Face */}
                  <View className="flex-row items-center justify-center mb-1">
                    <View className="w-2 h-2 rounded-full bg-white mx-2" />
                    <View className="w-2 h-2 rounded-full bg-white mx-2" />
                  </View>
                  <View className="w-4 h-1.5 rounded-full bg-white/80" />
                </View>

                {/* Torso */}
                <View 
                  className="w-24 h-28 rounded-t-3xl items-center"
                  style={{ backgroundColor: colors.primaryDark }}
                >
                  {/* Arms Container */}
                  <View className="flex-row justify-between w-40 absolute top-4">
                    {/* Left Arm */}
                    <Animated.View
                      style={{
                        transform: [
                          { translateY: handLeftY },
                          { translateX: handLeftX },
                        ],
                      }}
                    >
                      <View 
                        className="w-5 h-16 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <View 
                        className="w-6 h-6 rounded-full -mt-1 ml-[-2px]"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </Animated.View>

                    {/* Right Arm */}
                    <Animated.View
                      style={{
                        transform: [
                          { translateY: handRightY },
                          { translateX: handRightX },
                        ],
                      }}
                    >
                      <View 
                        className="w-5 h-16 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <View 
                        className="w-6 h-6 rounded-full -mt-1 ml-[-2px]"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </Animated.View>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Current Sign Label */}
            {currentSign && (
              <View className="mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                <Text style={{ color: colors.primary }} className="text-base font-bold">
                  Signing: "{currentSign}"
                </Text>
              </View>
            )}

            {!currentSign && !showDemo && (
              <View className="mt-4 items-center">
                <Ionicons name="hand-left" size={24} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted }} className="text-sm mt-2">
                  Enter text or try the demo
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* Demo Progress */}
          {showDemo && (
            <View className="px-4 py-3" style={{ backgroundColor: colors.surfaceLight }}>
              <View className="flex-row items-center justify-between mb-2">
                <Text style={{ color: colors.textSecondary }} className="text-xs">
                  Demo Progress
                </Text>
                <Text style={{ color: colors.textMuted }} className="text-xs">
                  {demoIndex + 1} / {demoSigns.length}
                </Text>
              </View>
              <View className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${((demoIndex + 1) / demoSigns.length) * 100}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </View>
          )}
        </View>

        {/* Coming Soon Notice */}
        <View className="mx-4 mt-4 p-4 rounded-xl border" style={{ backgroundColor: `${colors.purple}10`, borderColor: `${colors.purple}30` }}>
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={16} color={colors.purple} />
            <Text style={{ color: colors.purple }} className="text-xs font-bold ml-2">
              3D AVATAR COMING SOON
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary }} className="text-xs mt-1">
            We're working on a realistic 3D avatar that will sign with fluid, natural movements. Stay tuned!
          </Text>
        </View>

        {/* Text Input */}
        <View className="px-4 mt-4">
          <Text style={{ color: colors.text }} className="text-base font-bold mb-3">
            Enter Text to Sign
          </Text>
          <View 
            className="rounded-xl p-3"
            style={{ backgroundColor: colors.surface }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a word or phrase..."
              placeholderTextColor={colors.textMuted}
              style={{ color: colors.text }}
              className="text-sm min-h-[80px]"
              multiline
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity
            onPress={handleConvert}
            disabled={isProcessing || isAnimating || !inputText.trim()}
            className="mt-3 py-3 rounded-xl items-center flex-row justify-center"
            style={{ 
              backgroundColor: (isProcessing || isAnimating || !inputText.trim()) 
                ? colors.surfaceLight 
                : colors.primary 
            }}
          >
            {isProcessing ? (
              <>
                <Ionicons name="sync" size={18} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted }} className="text-sm font-semibold ml-2">
                  Processing...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="hand-left" size={18} color={!inputText.trim() ? colors.textMuted : colors.background} />
                <Text 
                  style={{ color: !inputText.trim() ? colors.textMuted : colors.background }} 
                  className="text-sm font-semibold ml-2"
                >
                  Convert to Sign
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Signs */}
        <View className="px-4 mt-6">
          <Text style={{ color: colors.text }} className="text-base font-bold mb-3">
            Quick Signs
          </Text>
          <View className="flex-row flex-wrap">
            {demoSigns.map((sign, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setInputText(sign.word);
                  animateSign(sign.word);
                }}
                disabled={isAnimating}
                className="mr-2 mb-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: colors.surface }}
              >
                <Text style={{ color: colors.text }} className="text-sm">
                  {sign.word}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};