import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Heart } from 'lucide-react-native';
import BaseModalScreen from './BaseModalScreen';
import { useFavorites } from '../hooks/useFavorites';
import { exercises } from '../constants/exercises';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FavoritesScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function FavoritesScreen({ visible, onClose }: FavoritesScreenProps) {
  const { favorites, loading } = useFavorites();
  const router = useRouter();

  // Filter exercises to only show favorites
  const favoriteExercises = exercises.filter(exercise => 
    favorites.includes(exercise.id)
    
  );

  const handleExercisePress = (exerciseId: string) => {
    onClose();
    router.push(`/exercise/${exerciseId}`);
  };

  return (
    <BaseModalScreen
      visible={visible}
      onClose={onClose}
      title={`Favorites (${favoriteExercises.length})`}
      maxHeight={'50%'}
    >
      <View style={{ minHeight: SCREEN_HEIGHT * 0.3 }}>
        {loading ? (
          <View className="items-center py-8">
            <Text className="text-gray-600">Loading favorites...</Text>
          </View>
        ) : favorites.length === 0 ? (
          <View className="items-center py-8">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Heart size={32} color="#6B7280" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</Text>
            <Text className="text-gray-600 text-center">
              Start adding exercises to your favorites by tapping the heart icon on any exercise
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            <Text className="text-green-600 mb-4">Found {favoriteExercises.length} favorite exercises!</Text>
            {favoriteExercises.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleExercisePress(item.id)}
                className="bg-white rounded-xl border border-gray-200 mb-3 p-4"
                activeOpacity={0.7}
              >
                <Text className="text-lg font-semibold text-gray-900">
                  {item.name}
                </Text>
                <Text className="text-gray-600">Equipment: {item.equipment || 'None'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </BaseModalScreen>
  );
} 