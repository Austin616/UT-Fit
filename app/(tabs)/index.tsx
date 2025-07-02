import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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
import { useCallback, useState } from 'react';
import { useWorkoutLogger } from '../../hooks/useWorkoutLogger';
import { format } from 'date-fns';

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
    color: '#bf5700'
  },
  {
    id: '2',
    title: 'View History',
    icon: History,
    route: '/history',
    color: '#2563eb'
  },
  {
    id: '3',
    title: 'Share Progress',
    icon: TrendingUp,
    route: '/post',
    color: '#059669'
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
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const { getWorkoutHistory } = useWorkoutLogger();

  // Animation values
  const pageAnimationProgress = useSharedValue(0);

  const fetchRecentWorkouts = useCallback(async () => {
    try {
      const result = await getWorkoutHistory(2); // Get only 2 most recent workouts
      if (result.success && result.workouts) {
        setRecentWorkouts(result.workouts);
      }
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
    } finally {
      setLoadingWorkouts(false);
    }
  }, [getWorkoutHistory]);

  useFocusEffect(
    useCallback(() => {
      // Reset animations
      pageAnimationProgress.value = 0;
      setLoadingWorkouts(true);

      // Start animations and fetch data
      pageAnimationProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });

      fetchRecentWorkouts();

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

  const renderRecentWorkout = (workout: any, index: number) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      <TouchableOpacity 
        className="p-4" 
        activeOpacity={0.7}
        onPress={() => {
          router.push({
            pathname: '/(modals)/workout',
            params: { id: workout.id }
          });
        }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Dumbbell size={18} color="#bf5700" />
            <Text className="text-lg font-semibold ml-2">{workout.name}</Text>
          </View>
          <ChevronRight size={20} color="#6B7280" />
        </View>

        {/* Details */}
        <View className="flex-row items-center mb-3">
          <View className="flex-row items-center mr-4">
            <Calendar size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1">
              {format(new Date(workout.created_at), 'MMM d, yyyy')}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1">{workout.duration} min</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {workout.categories.map((category: string, i: number) => (
            <Animated.View 
              key={i}
              entering={FadeInDown.delay(i * 50).springify()}
              className="bg-ut_orange bg-opacity-10 px-3 py-1 rounded-full"
            >
              <Text className="text-white text-sm">{category}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Exercises */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {workout.exercises.map((exercise: any, i: number) => (
            <Animated.View 
              key={i}
              entering={FadeInDown.delay(i * 50).springify()}
              className="bg-gray-50 px-3 py-1 rounded-full"
            >
              <Text className="text-gray-700 text-sm">{exercise.name}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Exercise Count */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="flex-row items-center mt-1"
        >
          <TrendingUp size={16} color="#059669" />
          <Text className="text-green-600 ml-1 text-sm">
            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
          </Text>
        </Animated.View>
      </TouchableOpacity>
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
          <Text className="text-base text-gray-500 mt-1">Let&apos;s crush today&apos;s workout</Text>
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
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                  activeOpacity={0.7}
                >
                  <action.icon size={24} color={action.color} />
                  <Text className="mt-2 font-medium text-gray-900">{action.title}</Text>
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

          {loadingWorkouts ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#bf5700" />
            </View>
          ) : recentWorkouts.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-lg">No workouts yet</Text>
              <Text className="text-gray-400 mt-2">Start logging your workouts!</Text>
            </View>
          ) : (
            recentWorkouts.map((workout, index) => (
              <View key={workout.id}>
                {renderRecentWorkout(workout, index)}
              </View>
            ))
          )}
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
