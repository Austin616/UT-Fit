import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { WorkoutCategory } from '../../../../constants/workout';

interface WorkoutTypeSelectorProps {
  selectedCategory: string[];
  onPress: () => void;
}

export default function WorkoutTypeSelector({ selectedCategory, onPress }: WorkoutTypeSelectorProps) {
  return (
    <View className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <Text className="text-gray-800 text-lg font-semibold mb-3">Workout Type</Text>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl"
      >
        <Text className="text-gray-700">
          {selectedCategory.length > 0 
            ? selectedCategory.join(', ')
            : 'Select workout type'}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
} 