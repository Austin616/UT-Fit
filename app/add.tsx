import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  name: string;
  sets: Set[];
}

export default function AddWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: [{ weight: '', reps: '' }] }
  ]);

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const submitButtonScale = useSharedValue(1);

  // Animate title on mount
  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    titleTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [titleOpacity, titleTranslateY]);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const submitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }],
  }));

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
    // Animate button press
    submitButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // TODO: Handle saving the workout
    console.log({ workoutName, exercises });
  };

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Animated.View style={titleAnimatedStyle}>
          <Text className="text-2xl font-bold mb-6">Log Workout</Text>
        </Animated.View>
        
        {/* Workout Name */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="mb-6"
        >
          <Text className="text-gray-600 mb-2">Workout Name</Text>
          <TextInput
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Enter workout name"
            className="border border-gray-300 rounded-lg p-3"
          />
        </Animated.View>

        {/* Exercises */}
        {exercises.map((exercise, exerciseIndex) => (
          <Animated.View 
            key={exerciseIndex} 
            entering={FadeInUp.delay(exerciseIndex * 100).springify()}
            layout={Layout.springify()}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <Text className="text-gray-600 mb-2">Exercise Name</Text>
            <TextInput
              value={exercise.name}
              onChangeText={(text) => updateExerciseName(text, exerciseIndex)}
              placeholder="Enter exercise name"
              className="border border-gray-300 rounded-lg p-3 bg-white mb-4"
            />

            {/* Sets */}
            {exercise.sets.map((set, setIndex) => (
              <Animated.View 
                key={setIndex} 
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
              <Ionicons name="add-outline" size={20} color="#bf5700" />
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
          <Ionicons name="add-circle-outline" size={24} color="#bf5700" />
          <Text className="text-ut_orange ml-2 font-medium">Add Exercise</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          className="mb-6"
        >
          <AnimatedTouchableOpacity
            style={submitButtonAnimatedStyle}
            onPress={handleSubmit}
            className="bg-ut_orange p-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold">Save Workout</Text>
          </AnimatedTouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}