import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Plus, X, Check } from 'lucide-react-native';
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
import { WORKOUT_CATEGORIES, MUSCLE_GROUPS, MuscleGroup } from '../../constants/workout';
import { useWorkout } from '../../hooks/useWorkout';

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
  return (
    <Animated.View
      entering={FadeInDown.delay(setIndex * 50).springify()}
      layout={Layout.springify()}
      className="flex-row items-center mb-4 last:mb-0"
    >
      <View className="w-8 mr-4">
        <Text className="text-gray-500 font-medium text-center">{setIndex + 1}</Text>
      </View>
      <View className="flex-1 flex-row items-center">
        <View className="flex-1 mr-2">
          <TextInput
            value={set.weight}
            onChangeText={(text) => onUpdateSet(exerciseIndex, setIndex, 'weight', text)}
            placeholder="Weight"
            keyboardType="numeric"
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-center"
          />
        </View>
        <Text className="text-gray-500 mx-2">×</Text>
        <View className="flex-1 mr-2">
          <TextInput
            value={set.reps}
            onChangeText={(text) => onUpdateSet(exerciseIndex, setIndex, 'reps', text)}
            placeholder="Reps"
            keyboardType="numeric"
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-center"
          />
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
  const {
    workoutName,
    selectedCategory,
    exercises,
    showCategoryPicker,
    showMuscleGroupPicker,
    currentExerciseIndex,
    setWorkoutName,
    setShowCategoryPicker,
    setShowMuscleGroupPicker,
    setCurrentExerciseIndex,
    toggleCategory,
    toggleExerciseMuscleGroup,
    addExercise,
    deleteExercise,
    addSet,
    deleteSet,
    updateSet,
    updateExerciseName,
    validateWorkout,
  } = useWorkout();

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

  const handleSubmit = () => {
    submitButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    const validation = validateWorkout();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    console.log({ 
      workoutName,
      categories: selectedCategory,
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
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-ut_orange font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="max-h-96 p-4">
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
                      {exercises.length > 1 && (
                        <X size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Exercise Name Input */}
                  <View className="mb-4">
                    <Text className="text-gray-600 text-sm font-medium mb-2">Exercise Name</Text>
                    <TextInput
                      value={exercise.name}
                      onChangeText={(text) => updateExerciseName(exerciseIndex, text)}
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
                      <Text className="text-gray-700">
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