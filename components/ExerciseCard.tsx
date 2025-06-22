import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { X, Plus, ChevronDown, ImageIcon } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Exercise, MuscleGroup } from '../constants/workout';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  onDelete?: () => void;
  onUpdateName: (name: string) => void;
  onAddSet: () => void;
  onDeleteSet: (setIndex: number) => void;
  onUpdateSet: (setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onMuscleGroupPress: () => void;
  showDelete?: boolean;
  // Optional image handling props
  image?: string;
  onImagePress?: () => void;
}

export function ExerciseCard({
  exercise,
  exerciseIndex,
  onDelete,
  onUpdateName,
  onAddSet,
  onDeleteSet,
  onUpdateSet,
  onMuscleGroupPress,
  showDelete = true,
  image,
  onImagePress
}: ExerciseCardProps) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(exerciseIndex * 100).springify()}
      layout={Layout.springify()}
      className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-ut_orange text-lg font-semibold">Exercise {exerciseIndex + 1}</Text>
          {showDelete && onDelete && (
            <TouchableOpacity 
              onPress={onDelete}
              className="p-2 -mr-2"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Exercise Name Input */}
        <View className="mb-4">
          <Text className="text-gray-600 text-sm font-medium mb-2">Exercise Name</Text>
          <TextInput
            value={exercise.name}
            onChangeText={onUpdateName}
            placeholder="Enter exercise name"
            placeholderTextColor="#9CA3AF"
            className="text-base bg-gray-50 rounded-xl p-3 text-gray-900"
          />
        </View>

        {/* Optional Image */}
        {onImagePress && (
          <View className="mb-4">
            <Text className="text-gray-600 text-sm font-medium mb-2">Exercise Photo</Text>
            <TouchableOpacity
              onPress={onImagePress}
              className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <ImageIcon size={40} color="#6B7280" />
                  <Text className="text-gray-500 mt-2">Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {/* Exercise Muscle Groups */}
        <View>
          <Text className="text-gray-600 text-sm font-medium mb-2">Target Muscles</Text>
          <TouchableOpacity
            onPress={onMuscleGroupPress}
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
            onPress={onAddSet}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Plus size={18} color="#bf5700" />
            <Text className="text-ut_orange ml-1 font-medium">Add Set</Text>
          </TouchableOpacity>
        </View>

        {exercise.sets.map((set, setIndex) => (
          <Animated.View
            key={`set-${setIndex}`}
            entering={FadeInDown.springify()}
            layout={Layout.springify()}
            className="mb-2"
          >
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center bg-white rounded-xl p-3">
                <View className="w-10 h-10 rounded-full bg-ut_orange/10 items-center justify-center">
                  <Text className="text-ut_orange font-semibold">{setIndex + 1}</Text>
                </View>
                <View className="flex-1 flex-row gap-3 ml-2">
                  <View className="flex-1">
                    <TextInput
                      value={set.weight}
                      onChangeText={(text) => onUpdateSet(setIndex, 'weight', text)}
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
                      onChangeText={(text) => onUpdateSet(setIndex, 'reps', text)}
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
                  onPress={() => onDeleteSet(setIndex)}
                  className="ml-2 w-8 h-8 rounded-full bg-red-100 items-center justify-center"
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
} 