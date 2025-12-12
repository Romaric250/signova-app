import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';

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
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  
  const firstName = user?.name?.split(' ')[0] || 'there';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  const quickActions = [
    {
      id: 'translate',
      title: 'Live Translate',
      subtitle: 'Real-time conversation',
      icon: 'mic',
      colors: [colors.primary, colors.primaryDark] as const,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
      onPress: () => navigation.navigate('LiveCaptions' as never),
    },
    {
      id: 'dictionary',
      title: 'Sign Dictionary',
      subtitle: 'Learn new signs',
      icon: 'book',
      colors: [colors.primary, colors.primaryDark] as const,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
      onPress: () => navigation.navigate('Dictionary' as never),
    },
    {
      id: 'learn',
      title: 'Start Learning',
      subtitle: 'Interactive lessons',
      icon: 'school',
      colors: [colors.primary, colors.primaryDark] as const,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
      onPress: () => navigation.navigate('Learn' as never),
    },
  ];

  const featuredLesson = {
    title: 'Basics of ASL',
    description: 'Learn the alphabet and common greetings',
    progress: 35,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80',
  };

  const stats = [
    { label: 'Signs Learned', value: '24', icon: 'hand-left', color: colors.primary },
    { label: 'Day Streak', value: '7', icon: 'flame', color: colors.warning },
    { label: 'Minutes Today', value: '15', icon: 'time', color: colors.primary },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text style={{ color: colors.textSecondary }} className="text-xs">{greeting}</Text>
              <Text style={{ color: colors.text }} className="text-xl font-bold">{firstName} 👋</Text>
            </View>
            <TouchableOpacity 
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
              onPress={() => navigation.navigate('Profile' as never)}
            >
              <Ionicons name="person" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card - Live Translate */}
        <TouchableOpacity 
          className="mx-4 mt-3 rounded-2xl overflow-hidden"
          onPress={() => navigation.navigate('LiveCaptions' as never)}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80' }}
            className="h-40"
            imageStyle={{ borderRadius: 16 }}
          >
            <LinearGradient
              colors={['transparent', colors.background]}
              className="flex-1 justify-end p-4 rounded-2xl"
            >
              <View className="flex-row items-center mb-1">
                <View style={{ backgroundColor: colors.primary }} className="px-2 py-0.5 rounded-full mr-2">
                  <Text style={{ color: colors.background }} className="text-[10px] font-bold">FEATURED</Text>
                </View>
              </View>
              <Text style={{ color: colors.text }} className="text-lg font-bold">Start a Conversation</Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs mt-0.5">
                Speak naturally and see real-time transcription
              </Text>
              <View className="flex-row items-center mt-2">
                <View style={{ backgroundColor: colors.primary }} className="px-3 py-1.5 rounded-full flex-row items-center">
                  <Ionicons name="mic" size={14} color={colors.background} />
                  <Text style={{ color: colors.background }} className="text-xs font-semibold ml-1">Try Now</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* Stats Row */}
        <View className="flex-row mx-4 mt-4">
          {stats.map((stat, index) => (
            <View 
              key={stat.label}
              className={`flex-1 rounded-xl p-3 ${index < stats.length - 1 ? 'mr-2' : ''}`}
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name={stat.icon as any} size={16} color={stat.color} />
              <Text style={{ color: colors.text }} className="text-lg font-bold mt-1">{stat.value}</Text>
              <Text style={{ color: colors.textMuted }} className="text-[10px]">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-5">
          <Text style={{ color: colors.text }} className="text-base font-bold mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="w-[48%] mb-3 rounded-xl overflow-hidden"
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <ImageBackground
                  source={{ uri: action.image }}
                  className="h-28"
                  imageStyle={{ borderRadius: 12 }}
                >
                  <LinearGradient
                    colors={[action.colors[0], action.colors[1], colors.background]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="flex-1 p-3 justify-between rounded-xl"
                    style={{ opacity: 0.95 }}
                  >
                    <View className="w-8 h-8 bg-white/20 rounded-lg items-center justify-center">
                      <Ionicons name={action.icon as any} size={16} color={colors.text} />
                    </View>
                    <View>
                      <Text style={{ color: colors.text }} className="text-sm font-bold">{action.title}</Text>
                      <Text style={{ color: colors.textSecondary }} className="text-[10px]">{action.subtitle}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Learning */}
        <View className="px-4 mt-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text style={{ color: colors.text }} className="text-base font-bold">Continue Learning</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Learn' as never)}>
              <Text style={{ color: colors.primary }} className="text-xs">See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: colors.surface }}
            onPress={() => navigation.navigate('Learn' as never)}
            activeOpacity={0.8}
          >
            <View className="flex-row">
              <Image
                source={{ uri: featuredLesson.image }}
                className="w-24 h-24"
              />
              <View className="flex-1 p-3 justify-center">
                <Text style={{ color: colors.text }} className="text-sm font-bold">{featuredLesson.title}</Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs mt-0.5" numberOfLines={2}>
                  {featuredLesson.description}
                </Text>
                <View className="mt-2">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text style={{ color: colors.textMuted }} className="text-[10px]">Progress</Text>
                    <Text style={{ color: colors.primary }} className="text-[10px] font-bold">{featuredLesson.progress}%</Text>
                  </View>
                  <View className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceLight }}>
                    <View 
                      style={{ width: `${featuredLesson.progress}%`, backgroundColor: colors.primary }}
                      className="h-full rounded-full" 
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily Tip */}
        <View className="mx-4 mt-5 rounded-xl p-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.surfaceLight }}>
          <View className="flex-row items-start">
            <View className="w-8 h-8 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: `${colors.primary}30` }}>
              <Ionicons name="bulb" size={16} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text style={{ color: colors.primary }} className="text-[10px] font-bold mb-0.5">DAILY TIP</Text>
              <Text style={{ color: colors.text }} className="text-xs leading-4">
                Practice fingerspelling your name every morning to build muscle memory! 🤟
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-4 mt-5">
          <Text style={{ color: colors.text }} className="text-base font-bold mb-3">Recent Activity</Text>
          <View className="rounded-xl" style={{ backgroundColor: colors.surface }}>
            {/*
              Uncomment and modify the following code to display dynamic recent activities
              
              recentActivities.map((activity, index) => (
                <View 
                  key={index} 
                  className={`flex-row items-center p-3 ${index < recentActivities.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: colors.surfaceLight }}
                >
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    <Ionicons name={activity.icon as any} size={14} color={activity.color} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-xs">{activity.text}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-[10px]">{activity.time}</Text>
                  </View>
                </View>
              ))
            */}
            {/*
              Static recent activities for demonstration
            */}
            { [
              { icon: 'checkmark-circle', color: colors.primary, text: 'Completed "Greetings" lesson', time: '2h ago' },
              { icon: 'mic', color: colors.primary, text: 'Used Live Translate for 5 min', time: '5h ago' },
              { icon: 'book', color: colors.warning, text: 'Learned 3 new signs', time: 'Yesterday' },
            ].map((activity, index) => (
              <View 
                key={index} 
                className={`flex-row items-center p-3 ${index < 2 ? 'border-b' : ''}`}
                style={{ borderColor: colors.surfaceLight }}
              >
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <Ionicons name={activity.icon as any} size={14} color={activity.color} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: colors.text }} className="text-xs">{activity.text}</Text>
                  <Text style={{ color: colors.textMuted }} className="text-[10px]">{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
