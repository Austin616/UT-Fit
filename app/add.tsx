import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  name: string;
  sets: Set[];
  image: string | null;
}

export default function AddWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState('');
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: [{ weight: '', reps: '' }], image: null }
  ]);
  const [animationKey, setAnimationKey] = useState(0);

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const submitButtonScale = useSharedValue(1);

  // Animate title every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      titleOpacity.value = 0;
      titleTranslateY.value = 50;
      
      // Start animations
      titleOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
      titleTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      
      // Force re-mount of all animated components
      setAnimationKey(prev => prev + 1);
    }, [titleOpacity, titleTranslateY])
  );

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const submitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }],
  }));

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
    // Animate button press
    submitButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // TODO: Handle saving the workout
    console.log({ workoutName, bio, tags, coverPhoto, exercises });
  };

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <ScrollView className="flex-1 px-6 pt-6 pb-20" key={animationKey} showsVerticalScrollIndicator={false}>
        <Animated.View style={titleAnimatedStyle}>
          <Text className="text-2xl font-bold mb-6">Log Workout</Text>
        </Animated.View>
        
        {/* Cover Photo */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-6">
          <Text className="text-gray-600 mb-2">Cover Photo</Text>
          <TouchableOpacity
            onPress={() => pickImage(setCoverPhoto)}
            className="border border-gray-300 rounded-lg p-3 items-center justify-center h-48 bg-gray-50"
          >
            {coverPhoto ? (
              <Image source={{ uri: coverPhoto }} className="w-full h-full rounded-lg" />
            ) : (
              <>
                <Ionicons name="camera-outline" size={32} color="#bf5700" />
                <Text className="text-ut_orange mt-2">Add Cover Photo</Text>
              </>
            )}
          </TouchableOpacity>
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
            placeholder="e.g., Morning Push Day"
            className="border border-gray-300 rounded-lg p-3"
          />
        </Animated.View>

        {/* Bio */}
        <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-6">
          <Text className="text-gray-600 mb-2">Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="How was the workout?"
            className="border border-gray-300 rounded-lg p-3 h-24"
            multiline
          />
        </Animated.View>

        {/* Tags */}
        <Animated.View entering={FadeInDown.delay(400).springify()} className="mb-6">
          <Text className="text-gray-600 mb-2">Tags</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="e.g., push, chest, gym"
            className="border border-gray-300 rounded-lg p-3"
          />
        </Animated.View>

        {/* Exercises */}
        {exercises.map((exercise, exerciseIndex) => (
          <Animated.View 
            key={`${animationKey}-exercise-${exerciseIndex}`}
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

            {/* Exercise Image */}
            <TouchableOpacity
              onPress={() => pickImage((uri) => updateExerciseImage(uri, exerciseIndex))}
              className="border border-dashed border-gray-400 rounded-lg p-3 items-center justify-center h-32 bg-gray-100 mb-4"
            >
              {exercise.image ? (
                <Image source={{ uri: exercise.image }} className="w-full h-full rounded-lg" />
              ) : (
                <>
                  <Ionicons name="image-outline" size={24} color="#bf5700" />
                  <Text className="text-ut_orange mt-2 text-sm">Add Exercise Image</Text>
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