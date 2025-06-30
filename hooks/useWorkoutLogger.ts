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

  const logWorkout = useCallback(async (workoutData: WorkoutData) => {
    try {
      if (!user) throw new Error('User must be logged in to log a workout');

      // Start a Supabase transaction
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: workoutData.name,
          duration: workoutData.duration,
          categories: workoutData.categories,
          is_public: workoutData.isPublic ?? false
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Insert exercises
      for (let i = 0; i < workoutData.exercises.length; i++) {
        const exercise = workoutData.exercises[i];
        
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .insert({
            workout_id: workout.id,
            name: exercise.name,
            muscle_groups: exercise.primaryMuscles,
            order_in_workout: i,
            level: exercise.level,
            primary_muscles: exercise.primaryMuscles,
            secondary_muscles: exercise.secondaryMuscles,
            category: exercise.category,
            equipment: exercise.equipment,
            force: exercise.force,
            mechanic: exercise.mechanic
          })
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        // Insert sets for each exercise
        const sets = exercise.sets.map((set: Set, index: number) => ({
          exercise_id: exerciseData.id,
          weight: parseFloat(set.weight) || 0,
          reps: parseInt(set.reps) || 0,
          order_in_exercise: index
        }));

        const { error: setsError } = await supabase
          .from('sets')
          .insert(sets);

        if (setsError) throw setsError;
      }

      return { success: true, workoutId: workout.id };
    } catch (error) {
      console.error('Error logging workout:', error);
      return { success: false, error };
    }
  }, [user]);

  const getWorkoutHistory = useCallback(async (limit = 10, offset = 0) => {
    try {
      if (!user) throw new Error('User must be logged in to view workout history');

      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises (
            *,
            sets (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (workoutsError) throw workoutsError;

      return { success: true, workouts };
    } catch (error) {
      console.error('Error fetching workout history:', error);
      return { success: false, error };
    }
  }, [user]);

  return {
    logWorkout,
    getWorkoutHistory
  };
} 