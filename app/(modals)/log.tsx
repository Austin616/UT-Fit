import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Dimensions } from 'react-native';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Plus, X, Check } from 'lucide-react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeInDown,
  FadeInUp,
  Layout,
  Easing,
} from 'react-native-reanimated';
import { WORKOUT_CATEGORIES, MUSCLE_GROUPS, WorkoutCategory, MuscleGroup } from '../../constants/workout';

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  name: string;
  sets: Set[];
  muscleGroups: MuscleGroup[];
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = -75;

interface SetRowProps {
  exercise: Exercise;
  exerciseIndex: number;
  set: Set;
  setIndex: number;
  onDelete: (exerciseIndex: number, setIndex: number) => void;
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => void;
}

const SetRow = React.memo(({ 
  exercise, 
  exerciseIndex, 
  set, 
  setIndex,
  onDelete,
  onUpdateSet
}: SetRowProps) => {
  // Display the current position + 1 as the set number
  const displayNumber = setIndex + 1;

  return (
    <Animated.View 
      key={`set-${exerciseIndex}-${setIndex}`}
      entering={FadeInDown.springify()}
      layout={Layout.springify()}
      className="mb-2"
    >
      <View className="flex-row items-center">
        <View className="flex-1 flex-row items-center bg-white rounded-xl p-3">
          <View className="w-10 h-10 rounded-full bg-ut_orange/10 items-center justify-center">
            <Text className="text-ut_orange font-semibold">{displayNumber}</Text>
          </View>
          <View className="flex-1 flex-row gap-3 ml-2">
            <View className="flex-1">
              <TextInput
                value={set.weight}
                onChangeText={(text) => onUpdateSet(exerciseIndex, setIndex, 'weight', text)}
                placeholder="0"
                keyboardType="numeric"
                className="text-center text-gray-900 text-lg font-medium"
              />
              <Text className="text-gray-500 text-xs mt-1 text-center">lbs</Text>
            </View>
            <View className="w-0.5 bg-gray-200" />
            <View className="flex-1">
              <TextInput
                value={set.reps}
                onChangeText={(text) => onUpdateSet(exerciseIndex, setIndex, 'reps', text)}
                placeholder="0"
                keyboardType="numeric"
                className="text-center text-gray-900 text-lg font-medium"
              />
              <Text className="text-gray-500 text-xs mt-1 text-center">reps</Text>
            </View>
          </View>
        </View>
        {exercise.sets.length > 1 && (
          <TouchableOpacity 
            onPress={() => onDelete(exerciseIndex, setIndex)}
            className="ml-2 w-8 h-8 rounded-full bg-red-100 items-center justify-center"
          >
            <X size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
});

export default function LogWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: [{ weight: '', reps: '' }], muscleGroups: [] }
  ]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [showMuscleGroupPicker, setShowMuscleGroupPicker] = useState(false);
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

  const toggleExerciseMuscleGroup = (exerciseIndex: number, muscleGroup: MuscleGroup) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];
    
    if (exercise.muscleGroups.includes(muscleGroup)) {
      exercise.muscleGroups = exercise.muscleGroups.filter(mg => mg !== muscleGroup);
    } else {
      exercise.muscleGroups = [...exercise.muscleGroups, muscleGroup];
    }
    
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '' }], muscleGroups: [] }]);
  };

  const addSet = useCallback((exerciseIndex: number) => {
    setExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      const exercise = {...updatedExercises[exerciseIndex]};
      
      exercise.sets = [...exercise.sets, { weight: '', reps: '' }];
      updatedExercises[exerciseIndex] = exercise;
      
      return updatedExercises;
    });
  }, []);

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

  const deleteExercise = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(exerciseIndex, 1);
    setExercises(updatedExercises);
  };

  const deleteSet = useCallback((exerciseIndex: number, setIndex: number) => {
    console.log(`Attempting to delete set ${setIndex} from exercise ${exerciseIndex}`);
    
    setExercises(currentExercises => {
      // Don't delete if it's the last set
      if (currentExercises[exerciseIndex].sets.length <= 1) {
        return currentExercises;
      }

      // Create a new copy of exercises
      const newExercises = [...currentExercises];
      
      // Create a new copy of the specific exercise
      const exerciseToUpdate = {...newExercises[exerciseIndex]};
      
      // Remove only the specific set
      const updatedSets = exerciseToUpdate.sets.filter((_, index) => index !== setIndex);
      
      // Update the exercise with new sets
      exerciseToUpdate.sets = updatedSets;
      
      // Put the updated exercise back in the array
      newExercises[exerciseIndex] = exerciseToUpdate;
      
      console.log(`After deletion: ${updatedSets.length} sets remaining`);
      return newExercises;
    });
  }, []);

  const handleSubmit = () => {
    submitButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // TODO: Handle saving the workout
    console.log({ 
      workoutName,
      categories: selectedCategory,
      muscleGroups: selectedMuscleGroups,
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

  const renderPicker = (
    visible: boolean,
    onClose: () => void,
    title: string,
    options: readonly string[],
    selectedOptions: string[],
    onToggle: (option: any) => void
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200 ">
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-ut_orange font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="max-h-96 p-4 ">
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => onToggle(option)}
                className="flex-row items-center justify-between py-3 px-4"
              >
                <Text className="text-lg">{option}</Text>
                {selectedOptions.includes(option) && (
                  <Check size={24} color="#bf5700" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
          {/* Decorative UT-themed header */}
          
          <Animated.ScrollView 
            style={contentStyle}
            className="flex-1 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-4"
          >
          <View className="flex-row items-center px-6 justify-center">
            <Text className="text-2xl font-bold text-ut_orange mb-2">Log Workout</Text>
          </View>
            {/* Workout Name */}
            <Animated.View 
              entering={FadeInDown.delay(100).springify()} 
              className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <Text className="text-ut text-lg font-semibold mb-2">Name your workout</Text>
              <TextInput
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="e.g., Morning Push Day"
                placeholderTextColor="#9CA3AF"
                className="text-base text-gray-900 border-b border-gray-200 pb-2 px-1"
              />
            </Animated.View>

            {/* Workout Categories */}
            <Animated.View 
              entering={FadeInDown.delay(200).springify()} 
              className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <Text className="text-gray-800 text-lg font-semibold mb-3">Workout Type</Text>
              <TouchableOpacity
                onPress={() => setShowCategoryPicker(true)}
                className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <Text className="text-gray-700">
                  {selectedCategory.length > 0 
                    ? selectedCategory.join(', ')
                    : 'Select workout type'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </Animated.View>

            {/* Exercises */}
            <Text className="text-gray-800 text-xl font-bold mb-4 px-1">Exercises</Text>
            {exercises.map((exercise, exerciseIndex) => (
              <Animated.View 
                key={`exercise-${exerciseIndex}`}
                entering={FadeInUp.delay(exerciseIndex * 100).springify()}
                layout={Layout.springify()}
                className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <View className="p-4 border-b border-gray-100">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-ut_orange text-lg font-semibold">Exercise {exerciseIndex + 1}</Text>
                    <TouchableOpacity 
                      onPress={() => deleteExercise(exerciseIndex)}
                      className="p-2 -mr-2"
                    >
                      <X size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Exercise Name Input */}
                  <View className="mb-4">
                    <Text className="text-gray-600 text-sm font-medium mb-2">Exercise Name</Text>
                    <TextInput
                      value={exercise.name}
                      onChangeText={(text) => updateExerciseName(text, exerciseIndex)}
                      placeholder="Enter exercise name"
                      placeholderTextColor="#9CA3AF"
                      className="text-base bg-gray-50 rounded-xl p-3 text-gray-900"
                    />
                  </View>
                  
                  {/* Exercise Muscle Groups */}
                  <View>
                    <Text className="text-gray-600 text-sm font-medium mb-2">Target Muscles</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentExerciseIndex(exerciseIndex);
                        setShowMuscleGroupPicker(true);
                      }}
                      className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <Text className={`${exercise.muscleGroups.length > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                        {exercise.muscleGroups.length > 0 
                          ? exercise.muscleGroups.join(', ')
                          : 'Select target muscles'}
                      </Text>
                      <ChevronDown size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Sets */}
                <View className="p-4 bg-gray-50">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-ut_orange text-base font-semibold">Sets</Text>
                    <TouchableOpacity
                      onPress={() => addSet(exerciseIndex)}
                      className="flex-row items-center"
                      activeOpacity={0.7}
                    >
                      <Plus size={18} color="#bf5700" />
                      <Text className="text-ut_orange ml-1 font-medium">Add Set</Text>
                    </TouchableOpacity>
                  </View>

                  {exercise.sets.map((set, setIndex) => (
                    <SetRow
                      key={`set-${exerciseIndex}-${setIndex}`}
                      exercise={exercise}
                      exerciseIndex={exerciseIndex}
                      set={set}
                      setIndex={setIndex}
                      onDelete={deleteSet}
                      onUpdateSet={updateSet}
                    />
                  ))}
                </View>
              </Animated.View>
            ))}

            {/* Add Exercise Button */}
            <TouchableOpacity
              onPress={addExercise}
              className="flex-row items-center justify-center p-4 bg-gray-50 rounded-xl mb-6"
              activeOpacity={0.7}
            >
              <Plus size={20} color="#bf5700" />
              <Text className="text-ut_orange ml-2 font-medium">Add Exercise</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Animated.View entering={FadeInUp.delay(500).springify()} className="mb-6">
              <AnimatedTouchableOpacity
                style={submitButtonAnimatedStyle}
                onPress={handleSubmit}
                className="bg-ut_orange py-4 rounded-xl shadow-sm"
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-bold text-lg">Save Workout</Text>
              </AnimatedTouchableOpacity>
            </Animated.View>
          </Animated.ScrollView>
        </SafeAreaView>

        {/* Workout Type Picker Modal */}
        {renderPicker(
          showCategoryPicker,
          () => setShowCategoryPicker(false),
          'Select Workout Type',
          WORKOUT_CATEGORIES,
          selectedCategory,
          toggleCategory
        )}

        {/* Muscle Group Picker Modal */}
        {currentExerciseIndex !== null && renderPicker(
          showMuscleGroupPicker,
          () => {
            setShowMuscleGroupPicker(false);
            setCurrentExerciseIndex(null);
          },
          'Select Target Muscles',
          MUSCLE_GROUPS,
          exercises[currentExerciseIndex]?.muscleGroups || [],
          (muscleGroup) => toggleExerciseMuscleGroup(currentExerciseIndex, muscleGroup)
        )}
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
} 