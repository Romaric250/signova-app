import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

// Demo lesson content
const demoLesson = {
  title: 'Basic Greetings',
  description: 'Learn how to say hello, goodbye, and introduce yourself in sign language.',
  duration: '5 min',
  steps: [
    {
      id: 1,
      sign: 'Hello',
      instruction: 'Wave your hand with palm facing outward, moving it slightly side to side.',
      imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/h/hello.jpg',
      tip: 'Make eye contact and smile while signing!',
    },
    {
      id: 2,
      sign: 'My Name Is...',
      instruction: 'Point to yourself, then fingerspell your name or use your name sign.',
      imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/name.jpg',
      tip: 'Keep your movements smooth and clear.',
    },
    {
      id: 3,
      sign: 'Nice to Meet You',
      instruction: 'Point both index fingers toward each other and bring them together.',
      imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/m/meet.jpg',
      tip: 'This represents two people meeting.',
    },
    {
      id: 4,
      sign: 'Thank You',
      instruction: 'Touch your chin with your fingertips and move your hand forward.',
      imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/t/thankyou.jpg',
      tip: 'Like blowing a kiss of gratitude!',
    },
    {
      id: 5,
      sign: 'Goodbye',
      instruction: 'Open your hand, palm out, and wave by folding fingers down and up.',
      imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/g/goodbye.jpg',
      tip: 'A friendly wave to end the conversation.',
    },
  ],
};

// Upcoming courses preview
const upcomingCourses = [
  {
    id: 1,
    title: 'ASL Fundamentals',
    lessons: 12,
    duration: '2 hours',
    icon: 'school',
    color: colors.primary,
    description: 'Master the basics of American Sign Language',
  },
  {
    id: 2,
    title: 'Everyday Conversations',
    lessons: 8,
    duration: '1.5 hours',
    icon: 'chatbubbles',
    color: colors.blue,
    description: 'Common phrases for daily interactions',
  },
  {
    id: 3,
    title: 'Numbers & Counting',
    lessons: 5,
    duration: '45 min',
    icon: 'calculator',
    color: colors.purple,
    description: 'Learn to count and use numbers',
  },
  {
    id: 4,
    title: 'Family & Relationships',
    lessons: 6,
    duration: '1 hour',
    icon: 'people',
    color: colors.warning,
    description: 'Signs for family members and relationships',
  },
];

export const LearnScreen: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < demoLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteDemo = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    setShowDemo(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const progress = ((completedSteps.length) / demoLesson.steps.length) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text style={{ color: colors.text }} className="text-xl font-bold">
            Learn Sign Language
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-xs mt-0.5">
            Interactive lessons & courses
          </Text>
        </View>

        {/* Coming Soon Banner */}
        <View className="mx-4 mt-4 rounded-2xl overflow-hidden">
          <LinearGradient
            colors={[colors.primary, colors.primaryDark, '#1a5c3a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6"
          >
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                <Ionicons name="rocket" size={20} color={colors.text} />
              </View>
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-bold">
                  Coming Soon!
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="text-xs">
                  Full courses launching soon
                </Text>
              </View>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }} className="text-sm mt-2 leading-5">
              We're building an amazing learning experience with interactive lessons, 
              progress tracking, quizzes, and certificates. Stay tuned!
            </Text>
            <View className="flex-row mt-4">
              <View className="flex-row items-center mr-4">
                <Ionicons name="videocam" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="text-xs ml-1">Video Lessons</Text>
              </View>
              <View className="flex-row items-center mr-4">
                <Ionicons name="game-controller" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="text-xs ml-1">Quizzes</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="trophy" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="text-xs ml-1">Certificates</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Try Demo Section */}
        <View className="px-4 mt-6">
          <Text style={{ color: colors.text }} className="text-base font-bold mb-3">
            Try a Demo Lesson
          </Text>
          <TouchableOpacity
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: colors.surface }}
            onPress={() => setShowDemo(true)}
            activeOpacity={0.8}
          >
            <View className="h-32 bg-gradient-to-r justify-center items-center" style={{ backgroundColor: colors.surfaceLight }}>
              <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: `${colors.primary}30` }}>
                <Ionicons name="play" size={32} color={colors.primary} />
              </View>
            </View>
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <Text style={{ color: colors.text }} className="text-base font-bold">
                  {demoLesson.title}
                </Text>
                <View className="flex-row items-center px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                  <Ionicons name="time" size={12} color={colors.primary} />
                  <Text style={{ color: colors.primary }} className="text-xs ml-1">{demoLesson.duration}</Text>
                </View>
              </View>
              <Text style={{ color: colors.textSecondary }} className="text-xs mt-1">
                {demoLesson.description}
              </Text>
              <View className="flex-row items-center mt-3">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="layers" size={14} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted }} className="text-xs ml-1">{demoLesson.steps.length} steps</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={{ color: colors.textMuted }} className="text-xs ml-1">Beginner</Text>
                </View>
              </View>
              <TouchableOpacity 
                className="mt-3 py-2.5 rounded-xl items-center"
                style={{ backgroundColor: colors.primary }}
                onPress={() => setShowDemo(true)}
              >
                <Text style={{ color: colors.background }} className="text-sm font-semibold">
                  Start Demo Lesson
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Courses */}
        <View className="px-4 mt-6 mb-8">
          <Text style={{ color: colors.text }} className="text-base font-bold mb-3">
            Upcoming Courses
          </Text>
          {upcomingCourses.map((course) => (
            <View
              key={course.id}
              className="rounded-xl mb-3 p-4 flex-row items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <View 
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${course.color}20` }}
              >
                <Ionicons name={course.icon as any} size={24} color={course.color} />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.text }} className="text-sm font-bold">
                  {course.title}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs mt-0.5">
                  {course.description}
                </Text>
                <View className="flex-row items-center mt-1.5">
                  <Text style={{ color: colors.textMuted }} className="text-[10px]">
                    {course.lessons} lessons • {course.duration}
                  </Text>
                </View>
              </View>
              <View className="px-2 py-1 rounded-full" style={{ backgroundColor: colors.surfaceLight }}>
                <Text style={{ color: colors.textMuted }} className="text-[10px]">Soon</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Notify Me */}
        <View className="mx-4 mb-8 p-4 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.surfaceLight }}>
          <View className="flex-row items-center">
            <Ionicons name="notifications" size={20} color={colors.primary} />
            <Text style={{ color: colors.text }} className="text-sm font-bold ml-2">
              Get Notified
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary }} className="text-xs mt-2">
            Be the first to know when new courses are available!
          </Text>
          <TouchableOpacity 
            className="mt-3 py-2.5 rounded-xl items-center border"
            style={{ borderColor: colors.primary }}
          >
            <Text style={{ color: colors.primary }} className="text-sm font-semibold">
              Notify Me When Ready
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Demo Lesson Modal */}
      <Modal
        visible={showDemo}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowDemo(false)}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.surfaceLight }}>
              <TouchableOpacity onPress={() => setShowDemo(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <View className="flex-1 mx-4">
                <Text style={{ color: colors.text }} className="text-base font-bold text-center">
                  {demoLesson.title}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs text-center">
                  Step {currentStep + 1} of {demoLesson.steps.length}
                </Text>
              </View>
              <View className="w-6" />
            </View>

            {/* Progress Bar */}
            <View className="px-4 py-2">
              <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceLight }}>
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${progress}%`, 
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </View>

            {/* Lesson Content */}
            <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Current Sign */}
              <View className="items-center mt-4">
                <View 
                  className="w-full rounded-2xl items-center justify-center p-6"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Image
                    source={{ uri: demoLesson.steps[currentStep].imageUrl }}
                    className="w-40 h-40"
                    resizeMode="contain"
                    style={{ backgroundColor: colors.surfaceLight, borderRadius: 12 }}
                  />
                </View>
              </View>

              {/* Sign Name */}
              <View className="mt-4 items-center">
                <View className="px-4 py-2 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                  <Text style={{ color: colors.primary }} className="text-lg font-bold">
                    "{demoLesson.steps[currentStep].sign}"
                  </Text>
                </View>
              </View>

              {/* Instruction */}
              <View className="mt-4 p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="hand-left" size={16} color={colors.primary} />
                  <Text style={{ color: colors.text }} className="text-sm font-bold ml-2">
                    How to Sign
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary }} className="text-sm leading-5">
                  {demoLesson.steps[currentStep].instruction}
                </Text>
              </View>

              {/* Tip */}
              <View className="mt-3 p-4 rounded-xl border" style={{ backgroundColor: `${colors.warning}10`, borderColor: `${colors.warning}30` }}>
                <View className="flex-row items-center">
                  <Ionicons name="bulb" size={16} color={colors.warning} />
                  <Text style={{ color: colors.warning }} className="text-xs font-bold ml-2">
                    PRO TIP
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary }} className="text-xs mt-1">
                  {demoLesson.steps[currentStep].tip}
                </Text>
              </View>

              {/* Step Indicators */}
              <View className="flex-row justify-center mt-6">
                {demoLesson.steps.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentStep(index)}
                    className="mx-1"
                  >
                    <View 
                      className={`w-2.5 h-2.5 rounded-full`}
                      style={{ 
                        backgroundColor: index === currentStep 
                          ? colors.primary 
                          : completedSteps.includes(index) 
                          ? colors.primaryDark 
                          : colors.surfaceLight 
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Navigation Buttons */}
            <View className="px-4 py-4 border-t" style={{ borderColor: colors.surfaceLight }}>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex-1 py-3 rounded-xl items-center mr-2"
                  style={{ 
                    backgroundColor: currentStep === 0 ? colors.surfaceLight : colors.surface,
                  }}
                >
                  <Text 
                    style={{ color: currentStep === 0 ? colors.textMuted : colors.text }} 
                    className="text-sm font-semibold"
                  >
                    Previous
                  </Text>
                </TouchableOpacity>
                
                {currentStep === demoLesson.steps.length - 1 ? (
                  <TouchableOpacity
                    onPress={handleCompleteDemo}
                    className="flex-1 py-3 rounded-xl items-center ml-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text style={{ color: colors.background }} className="text-sm font-semibold">
                      Complete Demo 🎉
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleNextStep}
                    className="flex-1 py-3 rounded-xl items-center ml-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text style={{ color: colors.background }} className="text-sm font-semibold">
                      Next Step
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};