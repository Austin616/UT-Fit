import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface MuscleGroupCardProps {
  muscleGroup: string;
  exerciseCount: number;
}

export function MuscleGroupCard({ muscleGroup, exerciseCount }: MuscleGroupCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/muscleGroup/${muscleGroup.toLowerCase().replace(' ', '-')}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden"
    >
      <Text className="text-xl font-semibold text-gray-900 capitalize mb-2">
        {muscleGroup}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-600">
          {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
        </Text>
        <View className="bg-ut_orange bg-opacity-10 rounded-full px-3 py-1">
          <Text className="text-white text-sm font-medium">View All</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
} 