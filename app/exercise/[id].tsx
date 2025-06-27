import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { exercises } from '../../constants/exercises';
import {  Dumbbell, Activity, BarChart2 } from 'lucide-react-native';
import Header from '../(modals)/Header';
import { loadExerciseImage } from '../../constants/exerciseImages';
const { width } = Dimensions.get('window');

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = exercises.find(ex => ex.id === id);

  if (!exercise) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Exercise not found</Text>
      </View>
    );
  }

  const getImageSource = () => {
    if (exercise.images && exercise.images.length > 0) {
      return loadExerciseImage(exercise.id, 0);
    }
    return null;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Header />
      <View className="p-4">
        {/* Exercise Name */}
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {exercise.name}
        </Text>

        {/* Exercise Images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {exercise.images.map((image, index) => (
            <View
              key={index}
              className="mr-4 rounded-2xl overflow-hidden"
              style={{ width: width - 32, height: width - 32 }}
            >
              <Image
            source={getImageSource()}
            style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        {/* Exercise Info */}
        <View className="bg-white rounded-2xl p-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-1">
              <Activity size={20} className="text-gray-500" />
              <Text className="text-gray-800 font-semibold capitalize">{exercise.level}</Text>
            </View>
            {exercise.equipment && (
              <View className="flex-row items-center gap-1">
                <Dumbbell size={20} className="text-gray-500" />
                <Text className="text-gray-800 font-semibold capitalize">{exercise.equipment}</Text>
              </View>
            )}
            <View className="flex-row items-center gap-1">
              <BarChart2 size={20} className="text-gray-500" />
              <Text className="text-gray-800 font-semibold capitalize">{exercise.category}</Text>
            </View>
          </View>

          {/* Target Muscles */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">Target Muscles</Text>
            <View className="flex-row flex-wrap">
              {exercise.primaryMuscles.map((muscle) => (
                <View key={muscle} className="bg-ut_orange bg-opacity-10 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-white font-semibold capitalize">{muscle}</Text>
                </View>
              ))}
              {exercise.secondaryMuscles.map((muscle) => (
                <View key={muscle} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                  <Text className="text-gray-600 capitalize">{muscle}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">Instructions</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} className="flex-row mb-2">
                <Text className="text-ut_orange font-medium mr-2">{index + 1}.</Text>
                <Text className="text-gray-600 flex-1">{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 