import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { MuscleGroup, WORKOUT_CATEGORIES, MUSCLE_GROUPS } from '../../constants/workout';
import { WorkoutTypeSelector } from '../../components/WorkoutTypeSelector';
import { PickerModal } from '../../components/PickerModal';
import { ExerciseCard } from '../../components/ExerciseCard';
import { useWorkout } from '../../hooks/useWorkout';

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
    toggleExerciseMuscleGroup,
    validateWorkout,
    duration,
    setDuration,
  } = useWorkout();

  const [slides, setSlides] = useState<Slide[]>([{
    image: '',
    caption: '',
    exercise: { name: '', sets: [{ weight: '', reps: '' }], muscleGroups: [] }
  }]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number | null>(null);

  // Set management functions
  const handleAddSet = (slideIndex: number) => {
    setSlides(current => {
      const newSlides = [...current];
      newSlides[slideIndex].exercise.sets.push({ weight: '', reps: '' });
      return newSlides;
    });
  };

  const handleDeleteSet = (slideIndex: number, setIndex: number) => {
    setSlides(current => {
      const newSlides = [...current];
      if (newSlides[slideIndex].exercise.sets.length > 1) {
        newSlides[slideIndex].exercise.sets = newSlides[slideIndex].exercise.sets.filter((_, i) => i !== setIndex);
      }
      return newSlides;
    });
  };

  const handleUpdateSet = (slideIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setSlides(current => {
      const newSlides = [...current];
      newSlides[slideIndex].exercise.sets[setIndex][field] = value;
      return newSlides;
    });
  };

  const handleUpdateExerciseName = (slideIndex: number, name: string) => {
    setSlides(current => {
      const newSlides = [...current];
      newSlides[slideIndex].exercise.name = name;
      return newSlides;
    });
  };

  const handleToggleExerciseMuscleGroup = (slideIndex: number, muscleGroup: MuscleGroup) => {
    setSlides(current => {
      const newSlides = [...current];
      const exercise = newSlides[slideIndex].exercise;
      
      if (exercise.muscleGroups.includes(muscleGroup)) {
        exercise.muscleGroups = exercise.muscleGroups.filter(mg => mg !== muscleGroup);
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
      setSlides(current => {
        const newSlides = [...current];
        newSlides[slideIndex].image = result.assets[0].uri;
        return newSlides;
      });
    }
  };

  const addSlide = () => {
    setSlides(current => [...current, {
      image: '',
      caption: '',
      exercise: { name: '', sets: [{ weight: '', reps: '' }], muscleGroups: [] }
    }]);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides(current => current.filter((_, i) => i !== index));
  };

  const updateCaption = (slideIndex: number, caption: string) => {
    setSlides(current => {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
          <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-4 mb-6">
              <Text className="text-2xl font-bold text-gray-900">New Post</Text>
              <Text className="text-base text-gray-500 mt-1">Share your workout journey</Text>
            </View>

            {/* Workout Name */}
            <View className="px-4 mb-6">
              <TextInput
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="Workout Name"
                className="text-xl font-semibold text-gray-900"
              />
            </View>

            {/* Duration Input */}
            <View className="px-4 mb-6">
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="Duration (minutes)"
                keyboardType="numeric"
                className="text-lg text-gray-700"
              />
            </View>

            {/* Workout Type */}
            <View className="px-4">
              <WorkoutTypeSelector
                selectedCategory={selectedCategory}
                onPress={() => setShowCategoryPicker(true)}
              />
            </View>

            {/* Slides */}
            {slides.map((slide, slideIndex) => (
              <View key={`slide-${slideIndex}`} className="px-4">
                <Animated.View
                  entering={FadeInUp.delay(slideIndex * 100).springify()}
                  className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Slide Header */}
                  <View className="p-4 flex-row items-center justify-between border-b border-gray-100">
                    <Text className="text-lg font-semibold text-gray-900">Slide {slideIndex + 1}</Text>
                    {slides.length > 1 && (
                      <TouchableOpacity
                        onPress={() => deleteSlide(slideIndex)}
                        className="p-2 -mr-2"
                      >
                        <X size={20} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Caption */}
                  <View className="p-4 border-b border-gray-100">
                    <TextInput
                      value={slide.caption}
                      onChangeText={(text) => updateCaption(slideIndex, text)}
                      placeholder="Write a caption..."
                      multiline
                      className="text-gray-900 min-h-[60px]"
                    />
                  </View>

                  {/* Exercise Card */}
                  <ExerciseCard
                    exercise={slide.exercise}
                    exerciseIndex={slideIndex}
                    onUpdateName={(name) => handleUpdateExerciseName(slideIndex, name)}
                    onAddSet={() => handleAddSet(slideIndex)}
                    onDeleteSet={(setIndex) => handleDeleteSet(slideIndex, setIndex)}
                    onUpdateSet={(setIndex, field, value) => handleUpdateSet(slideIndex, setIndex, field, value)}
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
              className="mx-4 mb-8 p-4 border-2 border-dashed border-gray-200 rounded-xl items-center"
              activeOpacity={0.7}
            >
              <Plus size={24} color="#6B7280" />
              <Text className="text-gray-600 font-medium mt-2">Add Another Slide</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Post Button */}
          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              className="w-full bg-ut_orange py-4 rounded-xl items-center"
              activeOpacity={0.7}
              onPress={onSubmit}
            >
              <Text className="text-white font-semibold text-lg">Post Workout</Text>
            </TouchableOpacity>
          </View>
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
          onToggle={(muscleGroup) => handleToggleExerciseMuscleGroup(currentSlideIndex, muscleGroup)}
        />
      )}
    </GestureHandlerRootView>
  );
} 