import { View, Text, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Dumbbell, ChevronRight, TrendingUp } from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

// Mock data - replace with real data later
const MOCK_WORKOUTS = [
  {
    id: '1',
    name: 'Morning Push Day',
    date: '2024-03-10',
    duration: '45 min',
    exercises: ['Bench Press', 'Shoulder Press', 'Tricep Extensions'],
    category: 'Strength',
    progress: '+5 lbs on bench'
  },
  {
    id: '2',
    name: 'Leg Day',
    date: '2024-03-09',
    duration: '60 min',
    exercises: ['Squats', 'Romanian Deadlifts', 'Leg Press'],
    category: 'Strength',
    progress: 'New PR on squats'
  },
  {
    id: '3',
    name: 'Cardio Session',
    date: '2024-03-08',
    duration: '30 min',
    exercises: ['Treadmill Run', 'Jump Rope', 'Burpees'],
    category: 'Cardio',
    progress: 'Improved pace'
  },
  {
    id: '4',
    name: 'Back & Biceps',
    date: '2024-03-07',
    duration: '50 min',
    exercises: ['Pull-ups', 'Barbell Rows', 'Bicep Curls'],
    category: 'Strength',
    progress: '+2 pull-ups'
  },
];

type TimeFilter = 'week' | 'month' | 'year';

export default function HistoryScreen() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  // Animation values
  const pageAnimationProgress = useSharedValue(0);
  const filterScale = useSharedValue(1);

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

  const handleFilterPress = (filter: TimeFilter) => {
    filterScale.value = withSpring(1, { damping: 15 });
    setTimeFilter(filter);
  };

  const renderWorkoutCard = (workout: typeof MOCK_WORKOUTS[0], index: number) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      <TouchableOpacity 
        className="p-4" 
        activeOpacity={0.7}
        onPress={() => {
          // Add animation for press feedback
          filterScale.value = withSequence(
            withTiming(0.95, { duration: 100 }),
            withTiming(1, { duration: 100 })
          );
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
            <Text className="text-gray-600 ml-1">{workout.date}</Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1">{workout.duration}</Text>
          </View>
        </View>

        {/* Exercises */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {workout.exercises.map((exercise, i) => (
            <Animated.View 
              key={i}
              entering={FadeInDown.delay(i * 50).springify()}
              className="bg-gray-50 px-3 py-1 rounded-full"
            >
              <Text className="text-gray-700 text-sm">{exercise}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Progress */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="flex-row items-center mt-1"
        >
          <TrendingUp size={16} color="#059669" />
          <Text className="text-green-600 ml-1 text-sm">{workout.progress}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <Animated.ScrollView
        style={contentStyle}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16 }}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.springify()}
          className="px-4 pb-4"
        >
          <Text className="text-2xl font-bold text-gray-900">Workout History</Text>
          <Text className="text-base text-gray-500 mt-1">Track your fitness journey</Text>
        </Animated.View>

        {/* Time Filter */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="flex-row px-4 mb-4"
        >
          {(['week', 'month', 'year'] as const).map((filter) => (
            <TouchableOpacity
              key={`filter-${filter}`}
              onPress={() => handleFilterPress(filter)}
              className={`mr-2 px-4 py-2 rounded-full ${
                timeFilter === filter ? 'bg-ut_orange' : 'bg-gray-100'
              }`}
            >
              <Animated.Text
                style={{ transform: [{ scale: filterScale }] }}
                className={`capitalize ${
                  timeFilter === filter ? 'text-white font-medium' : 'text-gray-600'
                }`}
              >
                {filter}
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Workout List */}
        <View className="px-4">
          {MOCK_WORKOUTS.map((workout) => (
            <View key={workout.id}>
              {renderWorkoutCard(workout, Number(workout.id) - 1)}
            </View>
          ))}
          
          {/* Add some bottom padding */}
          <View className="h-4" />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
