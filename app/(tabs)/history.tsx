import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
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
import { useWorkoutLogger } from '../../hooks/useWorkoutLogger';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

type TimeFilter = 'week' | 'month' | 'year';

export default function HistoryScreen() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getWorkoutHistory } = useWorkoutLogger();
  const router = useRouter();

  // Animation values
  const pageAnimationProgress = useSharedValue(0);
  const filterScale = useSharedValue(1);

  const fetchWorkouts = useCallback(async () => {
    try {
      const result = await getWorkoutHistory(50); // Get last 50 workouts
      if (result.success && result.workouts) {
        setWorkouts(result.workouts);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [getWorkoutHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWorkouts();
    setRefreshing(false);
  }, [fetchWorkouts]);

  useFocusEffect(
    useCallback(() => {
      // Reset animations
      pageAnimationProgress.value = 0;
      setLoading(true);

      // Start animations and fetch data
      pageAnimationProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });

      fetchWorkouts();

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

  const renderWorkoutCard = (workout: any, index: number) => (
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <Animated.ScrollView
        style={contentStyle}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#bf5700" />
            </View>
          ) : workouts.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-lg">No workouts found</Text>
              <Text className="text-gray-400 mt-2">Start logging your workouts!</Text>
            </View>
          ) : (
            workouts.map((workout, index) => (
              <View key={workout.id}>
                {renderWorkoutCard(workout, index)}
              </View>
            ))
          )}
          
          {/* Add some bottom padding */}
          <View className="h-4" />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
