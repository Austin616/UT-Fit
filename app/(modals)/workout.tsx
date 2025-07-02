import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Calendar, Clock, TrendingUp, ChevronRight, Dumbbell } from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { format } from 'date-fns';
import { useState, useCallback, useEffect } from 'react';
import { useWorkoutLogger } from '../../hooks/useWorkoutLogger';

export default function WorkoutDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getWorkoutById } = useWorkoutLogger();

  const fetchWorkoutDetails = useCallback(async () => {
    if (!id) return;
    try {
      const result = await getWorkoutById(id as string);
      if (result.success && result.workout) {
        setWorkout(result.workout);
      }
    } catch (error) {
      console.error('Error fetching workout details:', error);
    } finally {
      setLoading(false);
    }
  }, [id, getWorkoutById]);

  // Fetch workout details when screen mounts
  useEffect(() => {
    fetchWorkoutDetails();
  }, []);

  if (!workout && !loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">Workout not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Header */}
      <Animated.View 
        entering={FadeIn.duration(300)}
        className="flex-row items-center justify-center p-4 bg-white border-b border-gray-100 gap-2"
      >
        <Dumbbell
          size={20}
          color="#bf5700"
        />
        <Text className="text-xl font-semibold text-gray-900">Workout Details</Text>
      </Animated.View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#bf5700" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* Workout Summary */}
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            className="m-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <Text className="text-2xl font-bold text-gray-900 mb-3">
              {workout.name}
            </Text>
            
            <View className="flex-row items-center mb-4">
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
            <View className="flex-row flex-wrap gap-2 mb-4">
              {workout.categories.map((category: string, i: number) => (
                <View 
                  key={i}
                  className="bg-ut_orange bg-opacity-10 px-3 py-1 rounded-full"
                >
                  <Text className="text-white text-sm">{category}</Text>
                </View>
              ))}
            </View>

            {/* Quick Stats */}
            <View className="flex-row justify-between bg-gray-50 rounded-xl p-4">
              <View className="items-center">
                <Text className="text-gray-500 text-sm mb-1">Exercises</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {workout.exercises.length}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 text-sm mb-1">Total Sets</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {workout.exercises.reduce((acc: number, ex: any) => acc + ex.sets.length, 0)}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 text-sm mb-1">Volume</Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {workout.exercises.reduce((acc: number, ex: any) => 
                    acc + ex.sets.reduce((setAcc: number, set: any) => 
                      setAcc + (parseInt(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)
                  } lbs
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Exercise List */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Exercises
            </Text>
            {workout.exercises.map((exercise: any, index: number) => (
              <Animated.View
                key={exercise.id}
                entering={FadeInDown.delay(200 + index * 100).springify()}
                className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {exercise.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {exercise.equipment} • {exercise.level} • {exercise.mechanic}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => {
                      // Navigate to exercise history/analytics in the future
                    }}
                    className="p-2"
                  >
                    <ChevronRight size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Sets */}
                <View className="bg-gray-50 rounded-xl p-4">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Sets</Text>
                  <View className="space-y-2">
                    {exercise.sets.map((set: any, setIndex: number) => (
                      <View 
                        key={setIndex}
                        className="flex-row justify-between items-center"
                      >
                        <Text className="text-gray-600">Set {setIndex + 1}</Text>
                        <Text className="text-gray-900 font-medium">
                          {set.weight} lbs × {set.reps} reps
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Exercise Progress Indicator */}
                <View className="mt-4 flex-row items-center">
                  <TrendingUp size={16} color="#059669" />
                  <Text className="text-green-600 ml-1 text-sm">
                    +5 lbs from last workout
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
} 