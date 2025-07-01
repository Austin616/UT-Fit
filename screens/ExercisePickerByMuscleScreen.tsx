import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { X, Search, Heart } from 'lucide-react-native';
import { exercises } from '../constants/exercises';
import { Exercise } from '../hooks/useWorkout';
import { useFavorites } from '../hooks/useFavorites';

// Get unique muscle groups from all exercises
const MUSCLE_GROUPS = ['Favorites', ...Array.from(
  new Set(
    exercises.flatMap(exercise => [...exercise.primaryMuscles, ...(exercise.secondaryMuscles || [])])
  )
).sort()];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const ITEMS_PER_PAGE = 25;

export default function ExercisePickerByMuscleScreen({ visible, onClose, onSelectExercise }: Props) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const { favorites, isFavorited, toggleFavorite } = useFavorites();

  // Filter exercises based on search query and selected muscle group
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const searchTerms = query.split(/\s+/); // Split search query into terms

      filtered = filtered.filter(exercise => {
        // Create a single string of all searchable fields
        const searchableText = [
          exercise.name,
          exercise.equipment,
          exercise.level,
          exercise.mechanic,
          exercise.force,
          exercise.category,
          ...exercise.primaryMuscles,
          ...(exercise.secondaryMuscles || []),
          ...(exercise.instructions || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        // Check if all search terms are found in any of the fields
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Filter by favorites if selected
    if (selectedMuscleGroup === 'Favorites') {
      filtered = filtered.filter(exercise => isFavorited(exercise.id));
    }
    // Apply muscle group filter if selected
    else if (selectedMuscleGroup) {
      filtered = filtered.filter(exercise =>
        exercise.primaryMuscles.includes(selectedMuscleGroup) ||
        (exercise.secondaryMuscles && exercise.secondaryMuscles.includes(selectedMuscleGroup))
      );
    }

    return filtered;
  }, [searchQuery, selectedMuscleGroup, favorites, isFavorited]);

  const displayedExercises = useMemo(() => {
    return filteredExercises.slice(0, displayCount);
  }, [filteredExercises, displayCount]);

  const handleLoadMore = useCallback(() => {
    if (displayCount < filteredExercises.length) {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE);
    }
  }, [filteredExercises.length, displayCount]);

  const handleSelectExercise = useCallback((baseExercise: typeof exercises[0]) => {
    const exercise: Exercise = {
      ...baseExercise,
      sets: [{ weight: '', reps: '' }],
      muscleGroups: baseExercise.primaryMuscles as any,
      level: baseExercise.level || "beginner",
      category: baseExercise.category || 'strength',
      equipment: baseExercise.equipment || '',
      force: baseExercise.force || '',
      mechanic: baseExercise.mechanic || '',
      primaryMuscles: baseExercise.primaryMuscles,
      secondaryMuscles: baseExercise.secondaryMuscles || []
    };
    onSelectExercise(exercise);
    onClose();
  }, [onSelectExercise, onClose]);

  const renderExerciseItem = useCallback(({ item: exercise }: { item: typeof exercises[0] }) => (
    <TouchableOpacity
      onPress={() => handleSelectExercise(exercise)}
      className="bg-white p-4 rounded-xl mb-2 shadow-sm"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-medium text-gray-900 mb-1">{exercise.name}</Text>
          
          <Text className="text-sm text-gray-600 mb-2">
            {exercise.equipment} • {exercise.level} • {exercise.mechanic}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => toggleFavorite(exercise.id)}
          className="p-2"
        >
          <Heart 
            size={20} 
            color={isFavorited(exercise.id) ? '#ef4444' : '#9ca3af'}
            fill={isFavorited(exercise.id) ? '#ef4444' : 'none'}
          />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row flex-wrap">
        {exercise.primaryMuscles.map((muscle, idx) => (
          <View key={idx} className="bg-orange-50 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-ut_orange">
              {muscle}
            </Text>
          </View>
        ))}
        {exercise.secondaryMuscles?.map((muscle, idx) => (
          <View key={idx} className="bg-gray-50 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-gray-500">
              {muscle}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  ), [handleSelectExercise, isFavorited, toggleFavorite]);

  const renderFooter = useCallback(() => {
    if (displayCount >= filteredExercises.length) {
      return null;
    }
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#bf5700" />
      </View>
    );
  }, [filteredExercises.length, displayCount]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Select Exercise</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Search Bar */}
          <View className="p-4">
            <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl">
              <Search size={20} color="#6B7280" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search exercises..."
                className="flex-1 ml-2 text-base"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Muscle Group Tabs */}
          <FlatList
            data={MUSCLE_GROUPS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: muscle }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedMuscleGroup(muscle === selectedMuscleGroup ? null : muscle);
                  setDisplayCount(ITEMS_PER_PAGE);
                }}
                className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                  selectedMuscleGroup === muscle ? 'bg-ut_orange' : 'bg-gray-200'
                }`}
              >

                <Text
                  className={`${
                    selectedMuscleGroup === muscle ? 'text-white' : 'text-gray-700'
                  } font-medium`}
                >
                  {muscle}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
          />
        </View>

        {/* Exercise List */}
        <View className="flex-1 px-4 pt-4">
          {/* Results Count */}
          <Text className="text-gray-600 mb-4">
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Text>

          <FlatList
            data={displayedExercises}
            renderItem={renderExerciseItem}
            keyExtractor={item => item.id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={() => (
              <View className="items-center py-8">
                <Text className="text-gray-500 text-lg">
                  {selectedMuscleGroup === 'Favorites' 
                    ? 'No favorite exercises yet'
                    : 'No exercises found'}
                </Text>
                {selectedMuscleGroup === 'Favorites' && (
                  <Text className="text-gray-400 mt-2">
                    Tap the heart icon to add exercises to your favorites
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
} 