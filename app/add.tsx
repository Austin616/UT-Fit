import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
  name: string;
  sets: Array<{
    weight: string;
    reps: string;
  }>;
}

export default function AddWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: [{ weight: '', reps: '' }] }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '' }] }]);
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
    // TODO: Handle saving the workout
    console.log({ workoutName, exercises });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Log Workout</Text>
        
        {/* Workout Name */}
        <View className="mb-6">
          <Text className="text-gray-600 mb-2">Workout Name</Text>
          <TextInput
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Enter workout name"
            className="border border-gray-300 rounded-lg p-3"
          />
        </View>

        {/* Exercises */}
        {exercises.map((exercise, exerciseIndex) => (
          <View key={exerciseIndex} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-600 mb-2">Exercise Name</Text>
            <TextInput
              value={exercise.name}
              onChangeText={(text) => updateExerciseName(text, exerciseIndex)}
              placeholder="Enter exercise name"
              className="border border-gray-300 rounded-lg p-3 bg-white mb-4"
            />

            {/* Sets */}
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} className="flex-row mb-4">
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
              </View>
            ))}

            {/* Add Set Button */}
            <TouchableOpacity
              onPress={() => addSet(exerciseIndex)}
              className="flex-row items-center justify-center p-3 border border-ut_orange rounded-lg mb-2"
            >
              <Ionicons name="add-outline" size={20} color="#bf5700" />
              <Text className="text-ut_orange ml-2">Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Exercise Button */}
        <TouchableOpacity
          onPress={addExercise}
          className="flex-row items-center justify-center p-4 bg-gray-100 rounded-lg mb-6"
        >
          <Ionicons name="add-circle-outline" size={24} color="#bf5700" />
          <Text className="text-ut_orange ml-2 font-medium">Add Exercise</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-ut_orange p-4 rounded-lg mb-6"
        >
          <Text className="text-white text-center font-bold">Save Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}