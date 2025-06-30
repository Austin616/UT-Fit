import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Search } from 'lucide-react-native';
import BaseModalScreen from './BaseModalScreen';
import { Exercise } from '../constants/exercises';
import ExerciseListCard from '../app/(tabs)/explore/components/ExerciseListCard';

interface ExercisePickerScreenProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  exercises: Exercise[];
  selectedExercises?: Exercise[];
}

export default function ExercisePickerScreen({
  visible,
  onClose,
  onSelectExercise,
  exercises,
  selectedExercises = []
}: ExercisePickerScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.primaryMuscles.some(muscle =>
      muscle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise);
    onClose();
  };

  return (
    <BaseModalScreen
      visible={visible}
      onClose={onClose}
      title="Select Exercise"
      maxHeight="90%"
    >
      {/* Search Bar */}
      <View className="mb-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Search size={20} color="#6B7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search exercises..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900"
          />
        </View>
      </View>

      {/* Exercise List */}
      <View className="flex-1">
        <Text className="text-gray-600 mb-4">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </Text>
        
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseListCard
              exercise={item}
              onPress={() => handleSelectExercise(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </BaseModalScreen>
  );
} 