import * as React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Heart, Target, Dumbbell } from 'lucide-react-native';
import { Exercise } from '../constants/exercises';
import { useRouter } from 'expo-router';
import { loadExerciseImage } from '../constants/exerciseImages';

interface ExerciseListCardProps {
  exercise: Exercise;
}

export function ExerciseListCard({ exercise }: ExerciseListCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = React.useState(true);

  const getImageSource = () => {
    if (exercise.images && exercise.images.length > 0) {
      return loadExerciseImage(exercise.id, 0);
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/exercise/${exercise.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      {exercise.images && exercise.images.length > 0 && (
        <View className="w-full h-48 bg-gray-100">
          <Image
            source={getImageSource()}
            className="w-full h-full"
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          {imageLoading && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="large" color="#bf5700" />
            </View>
          )}
        </View>
      )}
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-900">{exercise.name}</Text>
          <View className="flex-row items-center space-x-2">
            <View className="bg-gray-100 rounded-full px-2 py-1">
              <Text className="text-xs text-gray-600 capitalize">{exercise.level}</Text>
            </View>
          </View>
        </View>
        
        <View className="flex-row items-center space-x-4 mb-2">
          {exercise.equipment && (
            <View className="flex-row items-center">
              <Dumbbell size={16} className="text-gray-500 mr-1" />
              <Text className="text-sm text-gray-600 capitalize">{exercise.equipment}</Text>
            </View>
          )}
          <View className="flex-row items-center">
            <Target size={16} className="text-gray-500 mr-1" />
            <Text className="text-sm text-gray-600">{exercise.primaryMuscles.join(', ')}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap">
          {exercise.primaryMuscles.map((muscle) => (
            <View key={muscle} className="bg-ut_orange bg-opacity-10 rounded-full px-2 py-1 mr-2 mb-2">
              <Text className="text-xs text-ut_orange capitalize">{muscle}</Text>
            </View>
          ))}
          {exercise.secondaryMuscles.map((muscle) => (
            <View key={muscle} className="bg-gray-100 rounded-full px-2 py-1 mr-2 mb-2">
              <Text className="text-xs text-gray-600 capitalize">{muscle}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
} 