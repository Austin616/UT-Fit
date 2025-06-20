import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  Layout,
  Easing,
} from 'react-native-reanimated';
import { WORKOUT_CATEGORIES, MUSCLE_GROUPS, WorkoutCategory, MuscleGroup } from '../../constants/workout';
import { Camera, Plus, ImageIcon } from 'lucide-react-native';

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  name: string;
  sets: Set[];
  image: string | null;
}

export default function PostWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: [{ weight: '', reps: '' }], image: null }
  ]);
  const [animationKey, setAnimationKey] = useState(0);

  // Animation values
  const pageAnimationProgress = useSharedValue(0);
  const submitButtonScale = useSharedValue(1);
  const headerOpacity = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      // Reset animations
      pageAnimationProgress.value = 0;
      headerOpacity.value = 0;

      // Start animations
      pageAnimationProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      headerOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });

      // Force re-mount of animated components
      setAnimationKey(prev => prev + 1);

      return () => {
        // Reset animations when screen loses focus
        pageAnimationProgress.value = 0;
        headerOpacity.value = 0;
      };
    }, [])
  );

  const toggleCategory = (category: WorkoutCategory) => {
    setSelectedCategory(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(muscleGroup)
        ? prev.filter(mg => mg !== muscleGroup)
        : [...prev, muscleGroup]
    );
  };

  const pickImage = async (callback: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      callback(result.assets[0].uri);
    }
  };

  const updateExerciseImage = (uri: string, index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].image = uri;
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '' }], image: null }]);
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({ weight: '', reps: '' });
    setExercises(updatedExercises);
  };

  const updateExerciseName = (text: string, index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].name = text;
    setExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  const handleSubmit = () => {
    submitButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // TODO: Handle saving and posting the workout
    console.log({ 
      workoutName,
      bio,
      categories: selectedCategory,
      muscleGroups: selectedMuscleGroups,
      coverPhoto,
      exercises 
    });
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: pageAnimationProgress.value,
    transform: [
      { translateY: withSpring((1 - pageAnimationProgress.value) * 50, { damping: 15 }) },
    ],
  }));

  const submitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }],
  }));

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <Animated.ScrollView 
        style={contentStyle}
        className="flex-1 px-6 pt-6" 
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold text-ut_orange mb-2">Get Started</Text>
        </View>
        {/* Cover Photo */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-600 font-semibold">Cover Photo</Text>
            <TouchableOpacity onPress={() => setCoverPhoto(null)}>
              <Text className="text-ut_orange">Clear</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => pickImage(setCoverPhoto)}
            className="border border-gray-300 rounded-lg p-3 items-center justify-center h-48 bg-gray-50 overflow-hidden"
          >
            {coverPhoto ? (
              <Image source={{ uri: coverPhoto }} className="w-full h-full rounded-lg" />
            ) : (
              <>
                <Camera size={32} color="#bf5700" />
                <Text className="text-ut_orange mt-2">Add Cover Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Workout Name */}
        <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-6">
          <Text className="text-gray-600 mb-2 font-semibold">Workout Name</Text>
          <TextInput
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="e.g., Morning Push Day"
            className="border border-gray-300 rounded-lg p-3"
          />
        </Animated.View>

        {/* Bio */}
        <Animated.View entering={FadeInDown.delay(250).springify()} className="mb-6">
          <Text className="text-gray-600 mb-2 font-semibold">Description</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Share details about your workout..."
            className="border border-gray-300 rounded-lg p-3 h-24"
            multiline
          />
        </Animated.View>

        {/* Workout Categories */}
        <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-6">
          <Text className="text-gray-600 mb-2 font-semibold">Workout Type</Text>
          <View className="flex-row flex-wrap gap-2">
            {WORKOUT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => toggleCategory(category)}
                className={`px-3 py-2 rounded-full border ${
                  selectedCategory.includes(category)
                    ? 'bg-ut_orange border-ut_orange'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text
                  className={`${
                    selectedCategory.includes(category)
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Muscle Groups */}
        <Animated.View entering={FadeInDown.delay(350).springify()} className="mb-6">
          <Text className="text-gray-600 mb-2 font-semibold">Muscle Groups</Text>
          <View className="flex-row flex-wrap gap-2">
            {MUSCLE_GROUPS.map((muscleGroup) => (
              <TouchableOpacity
                key={muscleGroup}
                onPress={() => toggleMuscleGroup(muscleGroup)}
                className={`px-3 py-2 rounded-full border ${
                  selectedMuscleGroups.includes(muscleGroup)
                    ? 'bg-ut_orange border-ut_orange'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text
                  className={`${
                    selectedMuscleGroups.includes(muscleGroup)
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {muscleGroup}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Exercises */}
        {exercises.map((exercise, exerciseIndex) => (
          <Animated.View 
            key={`${animationKey}-exercise-${exerciseIndex}`}
            entering={FadeInUp.delay(exerciseIndex * 100).springify()}
            layout={Layout.springify()}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <Text className="text-gray-600 mb-2 font-semibold">Exercise Name</Text>
            <TextInput
              value={exercise.name}
              onChangeText={(text) => updateExerciseName(text, exerciseIndex)}
              placeholder="Enter exercise name"
              className="border border-gray-300 rounded-lg p-3 bg-white mb-4"
            />

            {/* Optional Exercise Image */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Exercise Photo</Text>
              <TouchableOpacity onPress={() => updateExerciseImage('', exerciseIndex)}>
                <Text className="text-ut_orange">Clear</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => pickImage((uri) => updateExerciseImage(uri, exerciseIndex))}
              className="border border-dashed border-gray-400 rounded-lg p-3 items-center justify-center h-32 bg-gray-100 mb-4"
            >
              {exercise.image ? (
                <Image source={{ uri: exercise.image }} className="w-full h-full rounded-lg" />
              ) : (
                <>
                  <ImageIcon size={24} color="#bf5700" />
                  <Text className="text-ut_orange mt-2 text-sm">Add Exercise Photo (Optional)</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Sets */}
            {exercise.sets.map((set, setIndex) => (
              <Animated.View 
                key={`${animationKey}-set-${exerciseIndex}-${setIndex}`}
                entering={SlideInRight.delay(setIndex * 50).springify()}
                layout={Layout.springify()}
                className="flex-row mb-4"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-600 mb-1">Weight (lbs)</Text>
                  <TextInput
                    value={set.weight}
                    onChangeText={(text) => updateSet(exerciseIndex, setIndex, 'weight', text)}
                    placeholder="0"
                    keyboardType="numeric"
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-1">Reps</Text>
                  <TextInput
                    value={set.reps}
                    onChangeText={(text) => updateSet(exerciseIndex, setIndex, 'reps', text)}
                    placeholder="0"
                    keyboardType="numeric"
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                  />
                </View>
              </Animated.View>
            ))}

            {/* Add Set Button */}
            <TouchableOpacity
              onPress={() => addSet(exerciseIndex)}
              className="flex-row items-center justify-center p-3 border border-ut_orange rounded-lg mb-2"
              activeOpacity={0.7}
            >
              <Plus size={20} color="#bf5700" />
              <Text className="text-ut_orange ml-2">Add Set</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Add Exercise Button */}
        <TouchableOpacity
          onPress={addExercise}
          className="flex-row items-center justify-center p-4 bg-gray-100 rounded-lg mb-6"
          activeOpacity={0.7}
        >
          <Plus size={24} color="#bf5700" />
          <Text className="text-ut_orange ml-2 font-medium">Add Exercise</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(500).springify()} className="mb-6">
          <AnimatedTouchableOpacity
            style={submitButtonAnimatedStyle}
            onPress={handleSubmit}
            className="bg-ut_orange p-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold">Post Workout</Text>
          </AnimatedTouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
} 