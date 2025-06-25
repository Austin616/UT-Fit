import { useState, useCallback, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, VirtualizedList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Exercise, getExercisesByMuscle } from '../../constants/exercises';
import { ExerciseListCard } from '../../components/ExerciseListCard';
import Header from '../(modals)/Header';

const ITEMS_PER_PAGE = 20;

export default function MuscleGroupPage() {
  const params = useLocalSearchParams();
  // Memoize the muscleGroup value to prevent unnecessary updates
  const muscleGroup = useMemo(() => 
    typeof params.muscleGroup === 'string' ? params.muscleGroup : '',
    [params.muscleGroup]
  );

  const [loading, setLoading] = useState(false);
  const [displayedExercises, setDisplayedExercises] = useState<Exercise[]>([]);
  
  // Memoize allExercises to prevent recalculation on every render
  const allExercises = useMemo(() => 
    getExercisesByMuscle(muscleGroup),
    [muscleGroup]
  );

  // Initialize with first page - now depends on memoized allExercises
  useEffect(() => {
    if (allExercises.length > 0) {
      setDisplayedExercises(allExercises.slice(0, ITEMS_PER_PAGE));
    }
  }, [allExercises]); // Only re-run when allExercises changes

  const loadMore = useCallback(() => {
    if (loading || displayedExercises.length >= allExercises.length) return;

    setLoading(true);
    setTimeout(() => {
      const nextItems = allExercises.slice(
        displayedExercises.length,
        displayedExercises.length + ITEMS_PER_PAGE
      );
      setDisplayedExercises(prev => [...prev, ...nextItems]);
      setLoading(false);
    }, 500);
  }, [displayedExercises.length, loading, allExercises]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#bf5700" />
      </View>
    );
  };

  const getItem = (_data: Exercise[], index: number) => displayedExercises[index];
  const getItemCount = () => displayedExercises.length;
  const keyExtractor = (item: Exercise) => item.id;
  const renderItem = ({ item }: { item: Exercise }) => <ExerciseListCard exercise={item} />;

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <VirtualizedList
        data={displayedExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemCount={getItemCount}
        getItem={getItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ padding: 16 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
} 