import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Dumbbell,
  History,
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// Mock data
const RECENT_WORKOUTS = [
  {
    id: '1',
    name: 'Morning Push Day',
    date: '2024-03-10',
    duration: '45 min',
    exercises: ['Bench Press', 'Shoulder Press', 'Tricep Extensions'],
    progress: '+5 lbs on bench'
  },
  {
    id: '2',
    name: 'Leg Day',
    date: '2024-03-09',
    duration: '60 min',
    exercises: ['Squats', 'Romanian Deadlifts', 'Leg Press'],
    progress: 'New PR on squats'
  }
];

const QUICK_ACTIONS = [
  {
    id: '1',
    title: 'Log Workout',
    icon: Plus,
    route: '/log',
    color: '#bf5700',
    isCircle: true
  },
  {
    id: '2',
    title: 'View History',
    icon: History,
    route: '/history',
    color: '#2563eb',
    isCircle: false
  },
  {
    id: '3',
    title: 'Share Progress',
    icon: TrendingUp,
    route: '/post',
    color: '#059669',
    isCircle: false
  }
];

// Add mock data for social feed
const SOCIAL_FEED = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isFollowing: true
    },
    workout: {
      name: 'Morning Push Day',
      date: '2024-03-10',
      duration: '45 min',
      exercises: ['Bench Press', 'Shoulder Press', 'Tricep Extensions'],
      progress: '+5 lbs on bench'
    },
    caption: 'Starting the week strong 💪 Hit a new PR on bench press!',
    likes: 124,
    comments: 8,
    images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e']
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Sarah Wilson',
      username: 'sarahfitness',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isFollowing: false
    },
    workout: {
      name: 'Full Body HIIT',
      date: '2024-03-09',
      duration: '30 min',
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Rope'],
      progress: 'Reduced rest time by 15s'
    },
    caption: 'Quick HIIT session to start the day! Who else loves morning workouts? 🌅',
    likes: 89,
    comments: 5,
    images: ['https://images.unsplash.com/photo-1549576490-b0b4831ef60a']
  }
];

export default function HomeScreen() {
  const router = useRouter();

  // Animation values
  const pageAnimationProgress = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      // Reset animations
      pageAnimationProgress.value = 0;

      // Start animations
      pageAnimationProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });

      return () => {
        // Reset animations when screen loses focus
        pageAnimationProgress.value = 0;
      };
    }, [])
  );

  const contentStyle = useAnimatedStyle(() => ({
    opacity: pageAnimationProgress.value,
    transform: [
      { translateY: withSpring((1 - pageAnimationProgress.value) * 50, { damping: 15 }) },
    ],
  }));

  const renderSocialPost = (post: typeof SOCIAL_FEED[0]) => (
    <Animated.View
      key={post.id}
      entering={FadeInDown.delay(100).springify()}
      className="mb-6 bg-white"
    >
      {/* Post Header */}
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <Image
            source={{ uri: post.user.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="font-semibold text-gray-900">{post.user.name}</Text>
            <Text className="text-gray-500 text-sm">@{post.user.username}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          {!post.user.isFollowing && (
            <TouchableOpacity
              className="bg-ut_orange rounded-full px-4 py-1.5 mr-3"
              activeOpacity={0.7}
            >
              <Text className="text-white font-medium">Follow</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Workout Details */}
      <View className="px-4 py-2 border-y border-gray-100">
        <View className="flex-row items-center mb-2">
          <Dumbbell size={18} color="#bf5700" />
          <Text className="text-lg font-semibold ml-2">{post.workout.name}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <View className="flex-row items-center mr-4">
            <Calendar size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1">{post.workout.date}</Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1">{post.workout.duration}</Text>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {post.workout.exercises.map((exercise, i) => (
            <View 
              key={i} 
              className="bg-gray-50 px-3 py-1 rounded-full"
            >
              <Text className="text-gray-700 text-sm">{exercise}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Post Image */}
      {post.images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          className="w-full aspect-square"
          resizeMode="cover"
        />
      ))}

      {/* Post Actions */}
      <View className="p-4">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity className="flex-row items-center mr-6">
            <Heart size={24} color="#6B7280" />
            <Text className="ml-2 text-gray-600">{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center mr-6">
            <MessageCircle size={24} color="#6B7280" />
            <Text className="ml-2 text-gray-600">{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Share2 size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Caption */}
        <Text className="text-gray-900">
          <Text className="font-semibold">{post.user.username}</Text>
          {' '}{post.caption}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <Animated.ScrollView
        style={contentStyle}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Animated.View 
          entering={FadeInDown.springify()}
          className="px-4 pt-2 pb-6"
        >
          <Text className="text-2xl font-bold text-gray-900">Welcome Back!</Text>
          <Text className="text-base text-gray-500 mt-1">Ready for another workout?</Text>
        </Animated.View>

        {/* Quick Actions */}
        <View className="px-4 mb-8">
          <View className="flex-row flex-wrap gap-4">
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInDown.delay(index * 100).springify()}
                className="flex-1 min-w-32"
              >
                <TouchableOpacity
                  onPress={() => router.push(action.route)}
                  className={`p-4 rounded-2xl ${!action.isCircle ? 'bg-white shadow-sm border border-gray-100' : ''}`}
                  activeOpacity={0.7}
                >
                  <View className={action.isCircle ? 'bg-ut_orange w-14 h-14 rounded-full items-center justify-center mb-2' : ''}>
                    <action.icon size={24} color={action.isCircle ? '#ffffff' : action.color} />
                  </View>
                  <Text className={`font-medium text-gray-900 ${action.isCircle ? 'text-center' : 'mt-2'}`}>{action.title}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Recent Workouts */}
        <View className="px-4 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Recent Workouts</Text>
            <TouchableOpacity
              onPress={() => router.push('/history')}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <Text className="text-ut_orange mr-1">View All</Text>
              <ChevronRight size={20} color="#bf5700" />
            </TouchableOpacity>
          </View>
          {RECENT_WORKOUTS.map((workout, index) => (
            <Animated.View
              key={workout.id}
              entering={FadeInDown.delay(index * 100).springify()}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 p-4"
            >
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <Dumbbell size={18} color="#bf5700" />
                  <Text className="text-lg font-semibold ml-2">{workout.name}</Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </View>
              <View className="flex-row items-center mb-3">
                <View className="flex-row items-center mr-4">
                  <Calendar size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">{workout.date}</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">{workout.duration}</Text>
                </View>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {workout.exercises.map((exercise, i) => (
                  <View key={i} className="bg-gray-50 px-3 py-1 rounded-full">
                    <Text className="text-gray-700 text-sm">{exercise}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Social Feed */}
        <View className="mb-8">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Social Feed</Text>
            <TouchableOpacity
              onPress={() => router.push('/social')}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <Text className="text-ut_orange mr-1">View More</Text>
              <ChevronRight size={20} color="#bf5700" />
            </TouchableOpacity>
          </View>
          {/* Show only first 2 posts in home feed */}
          {SOCIAL_FEED.slice(0, 2).map((post) => renderSocialPost(post))}
          <TouchableOpacity onPress={() => router.push('/social')}>
            <Text className="bg-ut_orange text-white rounded-full px-4 py-2 text-center mx-auto">View More</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
