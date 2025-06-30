import * as React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { Target, Dumbbell, Heart } from 'lucide-react-native';
import { Exercise } from '../../../../constants/exercises';
import { loadExerciseImage } from '../../../../constants/exerciseImages';
import { useFavorites } from '../../../../hooks/useFavorites';

interface ExerciseListCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export default function ExerciseListCard({ exercise, onPress }: ExerciseListCardProps) {
  const [imageLoading, setImageLoading] = React.useState(true);
  const { isFavorited, toggleFavorite } = useFavorites();

  const getImageSource = (): ImageSourcePropType | null => {
    if (exercise.images && exercise.images.length > 0) {
      return loadExerciseImage(exercise.id, 0);
    }
    return null;
  };

  const handleFavoritePress = async (e: any) => {
    e.stopPropagation(); // Prevent card press when heart is pressed
    await toggleFavorite(exercise.id);
  };

  const isExerciseFavorited = isFavorited(exercise.id);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      {exercise.images && exercise.images.length > 0 && (
        <View className="w-full h-48 bg-gray-100 relative">
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
          {/* Favorite Heart Icon */}
          <TouchableOpacity
            onPress={handleFavoritePress}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm"
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color={isExerciseFavorited ? "#EF4444" : "#6B7280"} 
              fill={isExerciseFavorited ? "#EF4444" : "none"}
            />
          </TouchableOpacity>
        </View>
      )}
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-900 flex-1">{exercise.name}</Text>
          {/* Heart icon for exercises without images */}
          {(!exercise.images || exercise.images.length === 0) && (
            <TouchableOpacity
              onPress={handleFavoritePress}
              className="ml-3 p-2"
              activeOpacity={0.7}
            >
              <Heart 
                size={20} 
                color={isExerciseFavorited ? "#EF4444" : "#6B7280"} 
                fill={isExerciseFavorited ? "#EF4444" : "none"}
              />
            </TouchableOpacity>
          )}
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