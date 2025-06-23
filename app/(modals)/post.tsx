import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { MuscleGroup, WORKOUT_CATEGORIES, MUSCLE_GROUPS } from '../../constants/workout';
import { WorkoutTypeSelector } from '../../components/WorkoutTypeSelector';
import { PickerModal } from '../../components/PickerModal';
import { ExerciseCard } from '../../components/ExerciseCard';
import { useWorkout } from '../../hooks/useWorkout';
import { useFocusEffect } from '@react-navigation/native';

interface Exercise {
  name: string;
  sets: { weight: string; reps: string }[];
  muscleGroups: MuscleGroup[];
}

interface Slide {
  image: string;
  caption: string;
  exercise: Exercise;
}

export default function PostWorkout() {
  const {
    workoutName,
    selectedCategory,
    showCategoryPicker,
    showMuscleGroupPicker,
    setWorkoutName,
    setShowCategoryPicker,
    setShowMuscleGroupPicker,
    toggleCategory,
    validateWorkout,
    duration,
    setDuration,
  } = useWorkout();

  const [slides, setSlides] = useState<Slide[]>([
    {
      image: '',
      caption: '',
      exercise: { name: '', sets: [{ weight: '', reps: '' }], muscleGroups: [] },
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number | null>(null);

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

      return () => {
        // Reset animations when screen loses focus
        pageAnimationProgress.value = 0;
        headerOpacity.value = 0;
      };
    }, [])
  );

  // Set management functions
  const handleAddSet = (slideIndex: number) => {
    setSlides((current) => {
      const newSlides = [...current];
      newSlides[slideIndex].exercise.sets.push({ weight: '', reps: '' });
      return newSlides;
    });
  };

  const handleDeleteSet = (slideIndex: number, setIndex: number) => {
    setSlides((current) => {
      const newSlides = [...current];
      if (newSlides[slideIndex].exercise.sets.length > 1) {
        newSlides[slideIndex].exercise.sets = newSlides[slideIndex].exercise.sets.filter(
          (_, i) => i !== setIndex
        );
      }
      return newSlides;
    });
  };

  const handleUpdateSet = (
    slideIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    setSlides((current) => {
      const newSlides = [...current];
      newSlides[slideIndex].exercise.sets[setIndex][field] = value;
      return newSlides;
    });
  };

  const handleUpdateExerciseName = (slideIndex: number, name: string) => {
    setSlides((current) => {
      const newSlides = [...current];
      newSlides[slideIndex].exercise.name = name;
      return newSlides;
    });
  };

  const handleToggleExerciseMuscleGroup = (slideIndex: number, muscleGroup: MuscleGroup) => {
    setSlides((current) => {
      const newSlides = [...current];
      const exercise = newSlides[slideIndex].exercise;

      if (exercise.muscleGroups.includes(muscleGroup)) {
        exercise.muscleGroups = exercise.muscleGroups.filter((mg) => mg !== muscleGroup);
      } else {
        exercise.muscleGroups = [...exercise.muscleGroups, muscleGroup];
      }

      return newSlides;
    });
  };

  const pickImage = async (slideIndex: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setSlides((current) => {
        const newSlides = [...current];
        newSlides[slideIndex].image = result.assets[0].uri;
        return newSlides;
      });
    }
  };

  const addSlide = () => {
    setSlides((current) => [
      ...current,
      {
        image: '',
        caption: '',
        exercise: { name: '', sets: [{ weight: '', reps: '' }], muscleGroups: [] },
      },
    ]);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides((current) => current.filter((_, i) => i !== index));
  };

  const updateCaption = (slideIndex: number, caption: string) => {
    setSlides((current) => {
      const newSlides = [...current];
      newSlides[slideIndex].caption = caption;
      return newSlides;
    });
  };

  const onSubmit = () => {
    const validation = validateWorkout();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    console.log('Workout Details:');
    console.log('----------------');
    console.log(`Workout Name: ${workoutName}`);
    console.log(`Categories: ${selectedCategory.join(', ')}`);
    console.log('\nSlides:');
    slides.forEach((slide, index) => {
      console.log(`\nSlide ${index + 1}:`);
      console.log(`Exercise: ${slide.exercise.name}`);
      console.log(`Target Muscles: ${slide.exercise.muscleGroups.join(', ')}`);
      console.log('Sets:');
      slide.exercise.sets.forEach((set, setIndex) => {
        console.log(`  Set ${setIndex + 1}: ${set.weight}lbs x ${set.reps} reps`);
      });
      if (slide.caption) {
        console.log(`Caption: ${slide.caption}`);
      }
    });

    alert('Workout posted successfully!');
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white">
        <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
          <Animated.ScrollView
            style={contentStyle}
            className="flex-1 pt-6"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-4">
            <View className="flex-row items-center justify-center px-6">
              <Text className="mb-2 text-2xl font-bold text-ut_orange">New Post</Text>
            </View>

            {/* Workout Name */}
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <Text className="text-ut mb-2 text-lg font-semibold">Name your workout</Text>
              <TextInput
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="e.g., Morning Push Day"
                placeholderTextColor="#9CA3AF"
                className="border-b border-gray-200 px-1 pb-2 text-base text-gray-900"
              />
            </Animated.View>

            {/* Duration Input */}
            <Animated.View
              entering={FadeInDown.delay(150).springify()}
              className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <Text className="text-ut mb-2 text-lg font-semibold">Duration (minutes)</Text>
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="e.g., 45"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="border-b border-gray-200 px-1 pb-2 text-base text-gray-900"
              />
            </Animated.View>

            {/* Workout Type */}
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <WorkoutTypeSelector
                selectedCategory={selectedCategory}
                onPress={() => setShowCategoryPicker(true)}
              />
            </Animated.View>

            {/* Slides */}
            {slides.map((slide, slideIndex) => (
              <View key={`slide-${slideIndex}`}>
                <Animated.View
                  entering={FadeInDown.delay(250 + slideIndex * 100).springify()}
                  className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {/* Slide Header */}
                  <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
                    <Text className="text-lg font-semibold text-ut_orange">
                      Slide {slideIndex + 1}
                    </Text>
                    {slides.length > 1 && (
                      <TouchableOpacity
                        onPress={() => deleteSlide(slideIndex)}
                        className="-mr-2 p-2">
                        <X size={20} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Caption */}
                  <View className="border-b border-gray-100 p-4">
                    <Text className="mb-2 text-sm font-medium text-gray-600">Caption</Text>
                    <TextInput
                      value={slide.caption}
                      onChangeText={(text) => updateCaption(slideIndex, text)}
                      placeholder="Write a caption..."
                      multiline
                      className="min-h-[60px] text-gray-900"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  {/* Exercise Card */}
                  <ExerciseCard
                    exercise={slide.exercise}
                    exerciseIndex={slideIndex}
                    onUpdateName={(name) => handleUpdateExerciseName(slideIndex, name)}
                    onAddSet={() => handleAddSet(slideIndex)}
                    onDeleteSet={(setIndex) => handleDeleteSet(slideIndex, setIndex)}
                    onUpdateSet={(setIndex, field, value) =>
                      handleUpdateSet(slideIndex, setIndex, field, value)
                    }
                    onMuscleGroupPress={() => {
                      setCurrentSlideIndex(slideIndex);
                      setShowMuscleGroupPicker(true);
                    }}
                    showDelete={false}
                    image={slide.image}
                    onImagePress={() => pickImage(slideIndex)}
                  />
                </Animated.View>
              </View>
            ))}

            {/* Add Slide Button */}
            <TouchableOpacity
              onPress={addSlide}
              className="mb-8 items-center rounded-xl border-2 border-dashed border-gray-200 p-4"
              activeOpacity={0.7}>
              <Plus size={24} color="#6B7280" />
              <Text className="mt-2 font-medium text-gray-600">Add Another Slide</Text>
            </TouchableOpacity>
          </Animated.ScrollView>

          {/* Post Button */}
          <Animated.View style={submitButtonAnimatedStyle} className="border-t border-gray-200 p-4">
            <TouchableOpacity
              className="w-full items-center rounded-xl bg-ut_orange py-4"
              activeOpacity={0.7}
              onPress={onSubmit}>
              <Text className="text-lg font-semibold text-white">Post Workout</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Workout Type Picker Modal */}
      <PickerModal
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        title="Select Workout Type"
        options={WORKOUT_CATEGORIES}
        selectedOptions={selectedCategory}
        onToggle={toggleCategory}
      />

      {/* Muscle Group Picker Modal */}
      {currentSlideIndex !== null && (
        <PickerModal
          visible={showMuscleGroupPicker}
          onClose={() => {
            setShowMuscleGroupPicker(false);
            setCurrentSlideIndex(null);
          }}
          title="Select Target Muscles"
          options={MUSCLE_GROUPS}
          selectedOptions={slides[currentSlideIndex].exercise.muscleGroups}
          onToggle={(muscleGroup) =>
            handleToggleExerciseMuscleGroup(currentSlideIndex, muscleGroup)
          }
        />
      )}
    </GestureHandlerRootView>
  );
}
