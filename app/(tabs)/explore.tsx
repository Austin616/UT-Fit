import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Dumbbell,
  ChevronRight,
  Heart,
  Timer,
  Target,
  Info,
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

// Mock data for exercise categories
const EXERCISE_CATEGORIES = [
  {
    id: '1',
    name: 'Strength Training',
    icon: '💪',
    color: '#bf5700',
  },
  {
    id: '2',
    name: 'Cardio',
    icon: '🏃',
    color: '#2563eb',
  },
  {
    id: '3',
    name: 'Flexibility',
    icon: '🧘‍♂️',
    color: '#059669',
  },
  {
    id: '4',
    name: 'Calisthenics',
    icon: '🤸',
    color: '#7c3aed',
  },
];

// Mock data for featured exercises
const FEATURED_EXERCISES = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    category: 'Strength Training',
    difficulty: 'Intermediate',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
    description: 'A compound exercise that primarily targets the chest muscles.',
    equipment: ['Barbell', 'Bench'],
    tips: [
      'Keep your feet flat on the ground',
      'Maintain a slight arch in your back',
      'Lower the bar to mid-chest level',
    ],
  },
  {
    id: '2',
    name: 'Pull-ups',
    category: 'Calisthenics',
    difficulty: 'Advanced',
    targetMuscles: ['Back', 'Biceps', 'Core'],
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34',
    description: 'A bodyweight exercise that builds upper body strength.',
    equipment: ['Pull-up Bar'],
    tips: [
      'Start with a full hang',
      'Keep your core tight',
      'Pull until your chin is over the bar',
    ],
  },
  {
    id: '3',
    name: 'Squats',
    category: 'Strength Training',
    difficulty: 'Beginner',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1604247584233-99c80a8aae2c',
    description: 'A fundamental lower body exercise for building leg strength.',
    equipment: ['None (Bodyweight)', 'Optional: Barbell'],
    tips: [
      'Keep your chest up',
      'Push your knees out',
      'Go as low as comfortable',
    ],
  },
];

const POPULAR_EXERCISES = [
  {
    id: '4',
    name: 'Deadlift',
    category: 'Strength Training',
    difficulty: 'Advanced',
    targetMuscles: ['Back', 'Hamstrings', 'Core'],
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2',
    description: 'A compound exercise that targets multiple muscle groups.',
    equipment: ['Barbell', 'Weight Plates'],
    tips: [
      'Keep the bar close to your body',
      'Maintain a neutral spine',
      'Drive through your heels',
    ],
  },
  {
    id: '5',
    name: 'Push-ups',
    category: 'Calisthenics',
    difficulty: 'Beginner',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a34',
    description: 'A classic bodyweight exercise for upper body strength.',
    equipment: ['None'],
    tips: [
      'Keep your body in a straight line',
      'Position hands slightly wider than shoulders',
      'Lower chest to ground',
    ],
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const renderExerciseCard = (exercise: typeof FEATURED_EXERCISES[0], index: number) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      <Image
        source={{ uri: exercise.image }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-900">{exercise.name}</Text>
          <TouchableOpacity>
            <Heart size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center mb-3">
          <View className="bg-gray-100 rounded-full px-3 py-1 mr-2">
            <Text className="text-gray-700">{exercise.category}</Text>
          </View>
          <View className="bg-gray-100 rounded-full px-3 py-1">
            <Text className="text-gray-700">{exercise.difficulty}</Text>
          </View>
        </View>

        <View className="flex-row items-center mb-3">
          <Target size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-1">
            {exercise.targetMuscles.join(', ')}
          </Text>
        </View>

        <Text className="text-gray-600 mb-3">{exercise.description}</Text>

        <TouchableOpacity 
          className="flex-row items-center justify-center bg-ut_orange rounded-xl py-2"
          activeOpacity={0.7}
        >
          <Info size={20} color="#ffffff" />
          <Text className="text-white font-medium ml-2">View Details</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <Animated.ScrollView
        style={contentStyle}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-2 pb-4">
          <Text className="text-2xl font-bold text-gray-900">Explore Exercises</Text>
          <Text className="text-base text-gray-500 mt-1">
            Discover new workouts and techniques
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-2 border border-gray-200">
            <Search size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search exercises..."
              className="flex-1 ml-2 text-base"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Categories</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {EXERCISE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                className={`mr-3 p-3 rounded-xl border ${
                  selectedCategory === category.id
                    ? 'bg-ut_orange border-ut_orange'
                    : 'bg-white border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-2">{category.icon}</Text>
                  <Text
                    className={`font-medium ${
                      selectedCategory === category.id
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Exercises */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Featured Exercises
          </Text>
          {FEATURED_EXERCISES.map((exercise, index) => (
            <View key={exercise.id}>
              {renderExerciseCard(exercise, index)}
            </View>
          ))}
        </View>

        {/* Popular Exercises */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Popular Exercises
          </Text>
          {POPULAR_EXERCISES.map((exercise, index) => (
            <View key={exercise.id}>
              {renderExerciseCard(exercise, index + FEATURED_EXERCISES.length)}
            </View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View className="h-4" />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}