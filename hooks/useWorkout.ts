import { useState, useCallback } from 'react';
import { WorkoutCategory, MuscleGroup } from '../constants/workout';

export interface Set {
  weight: string;
  reps: string;
}

export interface Exercise {
  name: string;
  sets: Set[];
  muscleGroups: MuscleGroup[];
}

export interface WorkoutState {
  workoutName: string;
  selectedCategory: WorkoutCategory[];
  exercises: Exercise[];
  duration: string;
}

export function useWorkout(initialExercises: Exercise[] = [{ 
  name: '', 
  sets: [{ weight: '', reps: '' }], 
  muscleGroups: [] 
}]) {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [duration, setDuration] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showMuscleGroupPicker, setShowMuscleGroupPicker] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);

  const toggleCategory = useCallback((category: WorkoutCategory) => {
    setSelectedCategory(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const toggleExerciseMuscleGroup = useCallback((exerciseIndex: number, muscleGroup: MuscleGroup) => {
    setExercises(prev => {
      const newExercises = [...prev];
      const exercise = {...newExercises[exerciseIndex]};
      
      if (exercise.muscleGroups.includes(muscleGroup)) {
        exercise.muscleGroups = exercise.muscleGroups.filter(mg => mg !== muscleGroup);
      } else {
        exercise.muscleGroups = [...exercise.muscleGroups, muscleGroup];
      }
      
      newExercises[exerciseIndex] = exercise;
      return newExercises;
    });
  }, []);

  const addExercise = useCallback(() => {
    setExercises(prev => [...prev, { 
      name: '', 
      sets: [{ weight: '', reps: '' }], 
      muscleGroups: [] 
    }]);
  }, []);

  const deleteExercise = useCallback((exerciseIndex: number) => {
    setExercises(prev => prev.filter((_, i) => i !== exerciseIndex));
  }, []);

  const addSet = useCallback((exerciseIndex: number) => {
    setExercises(prev => {
      const newExercises = [...prev];
      const exercise = {...newExercises[exerciseIndex]};
      
      exercise.sets = [...exercise.sets, { weight: '', reps: '' }];
      newExercises[exerciseIndex] = exercise;
      
      return newExercises;
    });
  }, []);

  const deleteSet = useCallback((exerciseIndex: number, setIndex: number) => {
    setExercises(prev => {
      // Don't delete if it's the last set
      if (prev[exerciseIndex].sets.length <= 1) {
        return prev;
      }

      const newExercises = [...prev];
      const exerciseToUpdate = {...newExercises[exerciseIndex]};
      
      // Remove only the specific set
      const updatedSets = exerciseToUpdate.sets.filter((_, index) => index !== setIndex);
      
      // Update the exercise with new sets
      exerciseToUpdate.sets = updatedSets;
      
      // Put the updated exercise back in the array
      newExercises[exerciseIndex] = exerciseToUpdate;
      
      return newExercises;
    });
  }, []);

  const updateSet = useCallback((exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercises(prev => {
      const newExercises = [...prev];
      newExercises[exerciseIndex].sets[setIndex][field] = value;
      return newExercises;
    });
  }, []);

  const updateExerciseName = useCallback((exerciseIndex: number, name: string) => {
    setExercises(prev => {
      const newExercises = [...prev];
      newExercises[exerciseIndex].name = name;
      return newExercises;
    });
  }, []);

  const validateWorkout = useCallback((): { isValid: boolean; message: string } => {
    if (!workoutName.trim()) {
      return { isValid: false, message: 'Please enter a workout name' };
    }

    if (selectedCategory.length === 0) {
      return { isValid: false, message: 'Please select at least one workout type' };
    }

    if (!duration.trim()) {
      return { isValid: false, message: 'Please enter workout duration' };
    }

    if (isNaN(Number(duration)) || Number(duration) <= 0) {
      return { isValid: false, message: 'Please enter a valid duration in minutes' };
    }

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      
      if (!exercise.name.trim()) {
        return { isValid: false, message: `Please enter a name for exercise ${i + 1}` };
      }

      if (exercise.muscleGroups.length === 0) {
        return { isValid: false, message: `Please select target muscles for exercise ${i + 1}` };
      }

      for (let j = 0; j < exercise.sets.length; j++) {
        const set = exercise.sets[j];
        if (!set.weight.trim() || !set.reps.trim()) {
          return { isValid: false, message: `Please fill in weight and reps for all sets in exercise ${i + 1}` };
        }
        
        if (isNaN(Number(set.weight)) || isNaN(Number(set.reps))) {
          return { isValid: false, message: `Please enter valid numbers for weight and reps in exercise ${i + 1}` };
        }
      }
    }

    return { isValid: true, message: '' };
  }, [workoutName, selectedCategory, exercises, duration]);

  return {
    // State
    workoutName,
    selectedCategory,
    exercises,
    duration,
    showCategoryPicker,
    showMuscleGroupPicker,
    currentExerciseIndex,

    // Setters
    setWorkoutName,
    setDuration,
    setShowCategoryPicker,
    setShowMuscleGroupPicker,
    setCurrentExerciseIndex,

    // Actions
    toggleCategory,
    toggleExerciseMuscleGroup,
    addExercise,
    deleteExercise,
    addSet,
    deleteSet,
    updateSet,
    updateExerciseName,
    validateWorkout,
  };
} 