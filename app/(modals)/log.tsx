import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, X, ChevronRight, Dumbbell, Clock, ChevronDown } from 'lucide-react-native';
import { Exercise } from '../../hooks/useWorkout';
import ExercisePickerByMuscleScreen from '../../screens/ExercisePickerByMuscleScreen';
import { useWorkout } from '../../hooks/useWorkout';
import { useWorkoutLogger } from '../../hooks/useWorkoutLogger';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PickerModal } from '../../components/PickerModal';
import { WORKOUT_CATEGORIES } from '../../constants/workout';

export default function LogScreen() {
  const router = useRouter();
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { 
    workoutName, 
    setWorkoutName, 
    exercises,
    duration,
    setDuration,
    selectedCategory,
    toggleCategory,
    addExercise, 
    deleteExercise, 
    updateSet,
    addSet,
    deleteSet,
    validateWorkout
  } = useWorkout();
  const { logWorkout } = useWorkoutLogger();

  const handleSelectExercise = (selectedExercise: Exercise) => {
    if (editingExerciseIndex !== null) {
      deleteExercise(editingExerciseIndex);
      addExercise(selectedExercise);
    } else {
      addExercise(selectedExercise);
    }
    setShowExercisePicker(false);
    setEditingExerciseIndex(null);
  };

  const handleSaveWorkout = async () => {
    // Validate workout
    const validation = validateWorkout();
    if (!validation.isValid) {
      Alert.alert('Invalid Workout', validation.message);
      return;
    }

    setIsSaving(true);
    try {
      const result = await logWorkout({
        name: workoutName.trim(),
        duration: parseInt(duration) || 0,
        categories: selectedCategory,
        exercises: exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set => ({
            weight: set.weight.trim(),
            reps: set.reps.trim()
          }))
        })),
        isPublic: false
      });

      if (!result.success) {
        throw new Error(result.error instanceof Error ? result.error.message : 'Failed to save workout');
      }

      Alert.alert(
        'Success',
        'Workout saved successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save workout. Please try again.'
      );
      console.error('Error saving workout:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOrEditExercise = (index?: number) => {
    setEditingExerciseIndex(index ?? null);
    setShowExercisePicker(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <SafeAreaView className="flex-1" edges={['bottom']}>
        {/* Header */}
        <Animated.View 
          entering={FadeIn.duration(300)}
          className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100"
        >
          <Text className="text-xl font-semibold text-gray-900 ">Log Workout</Text>
          <TouchableOpacity 
            onPress={handleSaveWorkout}
            disabled={isSaving}
            className={`${isSaving ? 'bg-gray-400' : 'bg-ut_orange'} px-5 py-2.5 rounded-full shadow-sm`}
          >
            <Text className="text-white font-semibold">
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Workout Name */}
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            className="mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <Text className="text-base font-medium text-gray-700 mb-2">
              Workout Name
            </Text>
            <TextInput
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="Enter workout name..."
              placeholderTextColor="#9CA3AF"
              className="text-lg text-gray-900"
            />
          </Animated.View>

          {/* Workout Type */}
          <Animated.View 
            entering={FadeInDown.delay(150).springify()}
            className="mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <Text className="text-base font-medium text-gray-700 mb-3">
              Workout Type
            </Text>
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

          {/* Duration */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            className="mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center mb-2">
              <Clock size={20} color="#6B7280" />
              <Text className="text-base font-medium text-gray-700 ml-2">
                Duration (minutes)
              </Text>
            </View>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              placeholder="Enter workout duration..."
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="text-lg text-gray-900"
            />
          </Animated.View>

          {/* Exercises */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-700 mb-4 px-1">
              Exercises
            </Text>
            
            {exercises.map((exercise, index) => (
              <Animated.View 
                key={exercise.id}
                entering={FadeInDown.delay(200 + index * 50).springify()}
                className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
              >
                {/* Exercise Header */}
                <TouchableOpacity 
                  onPress={() => handleAddOrEditExercise(index)}
                  className="flex-row justify-between items-center mb-4"
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {exercise.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {exercise.equipment} • {exercise.level} • {exercise.mechanic}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>

                {/* Delete Exercise Button */}
                <TouchableOpacity 
                  onPress={() => deleteExercise(index)}
                  className="absolute top-4 right-4 w-8 h-8 items-center justify-center rounded-full bg-red-50"
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>

                {/* Exercise Details */}
                <View className="mb-4">
                  <View className="flex-row flex-wrap">
                    {exercise.primaryMuscles.map((muscle, idx) => (
                      <View key={idx} className="bg-orange-50 rounded-full px-3 py-1 mr-2 mb-2">
                        <Text className="text-sm text-ut_orange">
                          {muscle}
                        </Text>
                      </View>
                    ))}
                    {exercise.secondaryMuscles?.map((muscle, idx) => (
                      <View key={idx} className="bg-gray-50 rounded-full px-3 py-1 mr-2 mb-2">
                        <Text className="text-sm text-gray-500">
                          {muscle}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Sets */}
                <View className="bg-gray-50 rounded-xl p-4">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Sets</Text>
                  {exercise.sets.map((set, setIndex) => (
                    <View 
                      key={setIndex}
                      className="flex-row items-center mb-3 last:mb-0"
                    >
                      <Text className="w-12 text-sm font-medium text-gray-500">Set {setIndex + 1}</Text>
                      <View className="flex-1 flex-row mx-2">
                        <View className="flex-1 mr-2">
                          <TextInput
                            value={set.weight}
                            onChangeText={(value) => updateSet(index, setIndex, 'weight', value)}
                            placeholder="Weight"
                            keyboardType="numeric"
                            className="bg-white px-4 py-2.5 rounded-lg text-center text-gray-900 border border-gray-200"
                          />
                        </View>
                        <View className="flex-1">
                          <TextInput
                            value={set.reps}
                            onChangeText={(value) => updateSet(index, setIndex, 'reps', value)}
                            placeholder="Reps"
                            keyboardType="numeric"
                            className="bg-white px-4 py-2.5 rounded-lg text-center text-gray-900 border border-gray-200"
                          />
                        </View>
                      </View>
                      {exercise.sets.length > 1 && (
                        <TouchableOpacity 
                          onPress={() => deleteSet(index, setIndex)}
                          className="w-8 h-8 items-center justify-center rounded-full bg-red-50 ml-2"
                        >
                          <X size={14} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  
                  {/* Add Set Button */}
                  <TouchableOpacity 
                    className="mt-3"
                    onPress={() => addSet(index)}
                  >
                    <Text className="text-ut_orange text-center font-medium">Add Set</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}

            {/* Add Exercise Button */}
            <Animated.View
              entering={FadeInDown.delay(200 + exercises.length * 50).springify()}
            >
              <TouchableOpacity 
                className="flex-row items-center justify-center p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-white"
                onPress={() => handleAddOrEditExercise()}
              >
                <Dumbbell size={20} color="#9CA3AF" />
                <Text className="ml-2 text-gray-600 font-medium">Add Exercise</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>

        {/* Exercise Picker Modal */}
        <ExercisePickerByMuscleScreen
          visible={showExercisePicker}
          onClose={() => {
            setShowExercisePicker(false);
            setEditingExerciseIndex(null);
          }}
          onSelectExercise={handleSelectExercise}
        />

        {/* Workout Type Picker Modal */}
        <PickerModal
          visible={showCategoryPicker}
          onClose={() => setShowCategoryPicker(false)}
          title="Select Workout Type"
          options={WORKOUT_CATEGORIES}
          selectedOptions={selectedCategory}
          onToggle={toggleCategory}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
} 