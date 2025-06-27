import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
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
import { exercises, muscleGroups } from '../../constants/exercises';
import { MuscleGroupCard } from '../../components/MuscleGroupCard';
import { ExerciseListCard } from '../../components/ExerciseListCard';


export default function ExploreScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Calculate exercise counts for each muscle group
  const muscleGroupCounts = useMemo(() => {
    return muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = exercises.filter(exercise => 
        exercise.primaryMuscles.includes(muscle) || 
        exercise.secondaryMuscles.includes(muscle)
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Filter exercises based on search term
  const filteredExercises = useMemo(() => {
    if (!searchTerm) return [];
    const searchLower = searchTerm.toLowerCase();
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchLower) ||
      exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchLower)) ||
      exercise.secondaryMuscles.some(muscle => muscle.toLowerCase().includes(searchLower)) ||
      exercise.category.toLowerCase().includes(searchLower) ||
      (exercise.equipment && exercise.equipment.toLowerCase().includes(searchLower))
    );
  }, [searchTerm]);


  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <Animated.ScrollView
        style={contentStyle}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="pt-2 pb-4">
          <Text className="text-2xl font-bold text-gray-900">Explore Exercises</Text>
          <Text className="text-base text-gray-500 mt-1">
            Discover new workouts and techniques
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2">
            <Search size={20} color="#6B7280" />
            <TextInput
              placeholder="Search exercises, muscles, or equipment..."
              className="flex-1 ml-2 text-gray-900"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Show search results if searching, otherwise show muscle groups */}
        {searchTerm ? (
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Search Results ({filteredExercises.length})
            </Text>
            {filteredExercises.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-gray-500 text-lg">No exercises found</Text>
              </View>
            ) : (
              filteredExercises.map((exercise, index) => (
                <Animated.View
                  key={exercise.id}
                  entering={FadeInDown.delay(index * 100).springify()}
                >
                  <ExerciseListCard exercise={exercise} />
                </Animated.View>
              ))
            )}
          </View>
        ) : (
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Muscle Groups
            </Text>
            <View className="grid grid-cols-2 gap-4">
              {muscleGroups.map((muscle, index) => (
                <Animated.View
                  key={muscle}
                  entering={FadeInDown.delay(index * 100).springify()}
                  className="flex-1"
                >
                  <MuscleGroupCard
                    muscleGroup={muscle}
                    exerciseCount={muscleGroupCounts[muscle]}
                  />
                </Animated.View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-4" />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}