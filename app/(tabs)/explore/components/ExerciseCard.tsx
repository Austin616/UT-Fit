import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { X, Plus, ChevronDown, ImageIcon } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { MuscleGroup } from '../../../../constants/workout';
import { Exercise as BaseExercise } from '../../../../constants/exercises';
import { loadExerciseImage } from '../../../../constants/exerciseImages';

interface Set {
  weight: string;
  reps: string;
}

interface Exercise extends BaseExercise {
  sets: Set[];
  muscleGroups: MuscleGroup[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  onUpdateName: (name: string) => void;
  onAddSet: () => void;
  onDeleteSet: (setIndex: number) => void;
  onUpdateSet: (setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onMuscleGroupPress: () => void;
  showDelete?: boolean;
  image?: string;
  onImagePress?: () => void;
}

export default function ExerciseCard({
  exercise,
  exerciseIndex,
  onUpdateName,
  onAddSet,
  onDeleteSet,
  onUpdateSet,
  onMuscleGroupPress,
  showDelete = true,
  image,
  onImagePress
}: ExerciseCardProps) {
  const [showEndPosition, setShowEndPosition] = useState(false);

  // Function to get the image source
  const getImageSource = (): ImageSourcePropType | null => {
    if (exercise.images && exercise.images.length > 0) {
      return loadExerciseImage(exercise.id, showEndPosition ? 1 : 0);
    }
    return null;
  };

  return (
    <View className="bg-white rounded-xl overflow-hidden">
      {/* Exercise Name */}
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-ut_orange text-lg font-semibold">Exercise {exerciseIndex + 1}</Text>
          {showDelete && (
            <TouchableOpacity 
              onPress={() => {}}
              className="p-2 -mr-2"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          value={exercise.name}
          onChangeText={onUpdateName}
          placeholder="Exercise name"
          placeholderTextColor="#9CA3AF"
          className="text-gray-900 text-base"
        />
      </View>

      {/* Target Muscles */}
      <TouchableOpacity
        onPress={onMuscleGroupPress}
        className="flex-row items-center justify-between p-4 border-b border-gray-100"
      >
        <View>
          <Text className="text-sm font-medium text-gray-600 mb-1">Target Muscles</Text>
          <Text className={`${exercise.muscleGroups.length > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
            {exercise.muscleGroups.length > 0 
              ? exercise.muscleGroups.join(', ')
              : 'Select target muscles'}
          </Text>
        </View>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      {/* Sets */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-sm font-medium text-gray-600">Sets</Text>
          <TouchableOpacity
            onPress={onAddSet}
            className="flex-row items-center"
          >
            <Plus size={16} color="#F97316" />
            <Text className="text-ut_orange ml-1">Add Set</Text>
          </TouchableOpacity>
        </View>

        {exercise.sets.map((set, setIndex) => (
          <Animated.View
            key={`set-${setIndex}`}
            entering={FadeInDown.delay(setIndex * 50).springify()}
            layout={Layout.springify()}
            className="mb-2"
          >
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center bg-gray-50 rounded-xl p-3">
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

      {/* Image Section */}
      {onImagePress && (
        <TouchableOpacity
          onPress={onImagePress}
          className="p-4 border-t border-gray-100"
        >
          {image ? (
            <Image
              source={getImageSource() || undefined}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-48 bg-gray-100 rounded-xl items-center justify-center">
              <ImageIcon size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
} 