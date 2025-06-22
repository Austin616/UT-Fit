import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Dumbbell, ChevronRight, TrendingUp } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

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

  const renderWorkoutCard = (workout: typeof MOCK_WORKOUTS[0], index: number) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      <TouchableOpacity className="p-4" activeOpacity={0.7}>
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
            <View 
              key={i} 
              className="bg-gray-50 px-3 py-1 rounded-full"
            >
              <Text className="text-gray-700 text-sm">{exercise}</Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <View className="flex-row items-center mt-1">
          <TrendingUp size={16} color="#059669" />
          <Text className="text-green-600 ml-1 text-sm">{workout.progress}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      {/* Header */}
      <Animated.View 
        entering={FadeIn}
        className="px-4 pt-2 pb-4"
      >
        <Text className="text-2xl font-bold text-gray-900">Workout History</Text>
        <Text className="text-base text-gray-500 mt-1">Track your fitness journey</Text>
      </Animated.View>

      {/* Time Filter */}
      <Animated.View 
        entering={FadeIn.delay(100)}
        className="flex-row px-4 mb-4"
      >
        {(['week', 'month', 'year'] as const).map((filter) => (
          <TouchableOpacity
            key={`filter-${filter}`}
            onPress={() => setTimeFilter(filter)}
            className={`mr-2 px-4 py-2 rounded-full ${
              timeFilter === filter ? 'bg-ut_orange' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`capitalize ${
                timeFilter === filter ? 'text-white font-medium' : 'text-gray-600'
              }`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Workout List */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {MOCK_WORKOUTS.map((workout) => (
          <View key={workout.id}>
            {renderWorkoutCard(workout, Number(workout.id) - 1)}
          </View>
        ))}
        
        {/* Add some bottom padding */}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
