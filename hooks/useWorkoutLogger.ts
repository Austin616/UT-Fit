import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Exercise } from '../constants/exercises';

interface Set {
  weight: string;
  reps: string;
}

interface ExerciseWithSets extends Exercise {
  sets: Set[];
}

interface WorkoutData {
  name: string;
  duration: number;
  categories: string[];
  exercises: ExerciseWithSets[];
  isPublic?: boolean;
}

export function useWorkoutLogger() {
  const { user } = useAuth();

  const logWorkout = useCallback(async (workout: {
    name: string;
    duration: number;
    categories: string[];
    exercises: {
      id: string;
      name: string;
      sets: { weight: string; reps: string; }[];
      equipment?: string;
      level?: string;
      mechanic?: string;
      force?: string;
      primaryMuscles: string[];
      secondaryMuscles?: string[];
      category?: string;
    }[];
    isPublic: boolean;
  }) => {
    if (!user) return { success: false, error: new Error('Not authenticated') };

    try {
      // Insert workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: workout.name,
          duration: workout.duration,
          categories: workout.categories,
          is_public: workout.isPublic
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Insert exercises and sets
      const exercisePromises = workout.exercises.map(async (exercise, index) => {
        // Insert exercise
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .insert({
            workout_id: workoutData.id,
            name: exercise.name,
            muscle_groups: exercise.primaryMuscles,
            order_in_workout: index,
            level: exercise.level,
            primary_muscles: exercise.primaryMuscles,
            secondary_muscles: exercise.secondaryMuscles,
            category: exercise.category || 'strength',
            equipment: exercise.equipment || '',
            force: exercise.force || '',
            mechanic: exercise.mechanic || ''
          })
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        // Insert sets
        const { error: setsError } = await supabase
          .from('sets')
          .insert(
            exercise.sets.map((set, setIndex) => ({
              exercise_id: exerciseData.id,
              weight: parseFloat(set.weight) || 0,
              reps: parseInt(set.reps) || 0,
              order_in_exercise: setIndex
            }))
          );

        if (setsError) throw setsError;

        return exerciseData;
      });

      await Promise.all(exercisePromises);

      return { success: true, workout: workoutData };
    } catch (error) {
      console.error('Error logging workout:', error);
      return { success: false, error };
    }
  }, [user]);

  const getWorkoutHistory = useCallback(async (limit?: number) => {
    if (!user) return { success: false, error: new Error('Not authenticated') };

    try {
      let query = supabase
        .from('workouts')
        .select(`
          *,
          exercises (
            *,
            sets (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match the expected format
      const workouts = data.map(workout => ({
        ...workout,
        exercises: workout.exercises.map((exercise: any) => ({
          ...exercise,
          sets: exercise.sets
        }))
      }));

      return { success: true, workouts };
    } catch (error) {
      console.error('Error fetching workout history:', error);
      return { success: false, error };
    }
  }, [user]);

  const getWorkoutById = useCallback(async (workoutId: string) => {
    if (!user) return { success: false, error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises (
            *,
            sets (*)
          )
        `)
        .eq('id', workoutId)
        .single();

      if (error) throw error;

      // Transform the data to match the expected format
      const workout = {
        ...data,
        exercises: data.exercises.map((exercise: any) => ({
          ...exercise,
          sets: exercise.sets
        }))
      };

      return { success: true, workout };
    } catch (error) {
      console.error('Error fetching workout:', error);
      return { success: false, error };
    }
  }, [user]);

  return {
    logWorkout,
    getWorkoutHistory,
    getWorkoutById
  };
} 