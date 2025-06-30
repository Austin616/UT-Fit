import * as React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { Target, Dumbbell } from 'lucide-react-native';
import { Exercise } from '../../../../constants/exercises';
import { loadExerciseImage } from '../../../../constants/exerciseImages';

interface ExerciseListCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export default function ExerciseListCard({ exercise, onPress }: ExerciseListCardProps) {
  const [imageLoading, setImageLoading] = React.useState(true);

  const getImageSource = (): ImageSourcePropType | null => {
    if (exercise.images && exercise.images.length > 0) {
      return loadExerciseImage(exercise.id, 0);
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      {exercise.images && exercise.images.length > 0 && (
        <View className="w-full h-48 bg-gray-100">
          <Image
            source={getImageSource() || undefined}
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
        
        <View className="flex-row items-center gap-2 mb-2">
          {exercise.equipment && (
            <View className="flex-row items-center gap-1">
              <Dumbbell size={16} className="text-gray-500" />
              <Text className="text-sm text-gray-600 capitalize">{exercise.equipment}</Text>
            </View>
          )}
          <View className="flex-row items-center gap-1">
            <Target size={16} className="text-gray-500" />
            <Text className="text-sm text-gray-600 capitalize">{exercise.force || 'Unknown'}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap">
          {exercise.primaryMuscles.map((muscle) => (
            <View key={muscle} className="bg-ut_orange bg-opacity-10 rounded-full px-2 py-1 mr-2 mb-2">
              <Text className="text-xs text-white capitalize">{muscle}</Text>
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