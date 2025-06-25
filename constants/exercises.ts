import exercisesData from './exercises.json';

export interface Exercise {
  id: string;
  name: string;
  force?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  mechanic?: string;
  equipment?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

export const exercises: Exercise[] = exercisesData;

// Get unique muscle groups from the exercises
export const muscleGroups = Array.from(new Set(
  exercises.flatMap(exercise => [...exercise.primaryMuscles, ...exercise.secondaryMuscles])
)).sort();

// Get unique categories from the exercises
export const categories = Array.from(new Set(
  exercises.map(exercise => exercise.category)
)).sort();

// Get unique equipment types from the exercises
export const equipmentTypes = Array.from(new Set(
  exercises.map(exercise => exercise.equipment).filter(Boolean)
)).sort();

// Helper function to get exercises by muscle group
export const getExercisesByMuscle = (muscle: string) => {
  return exercises.filter(exercise => 
    exercise.primaryMuscles.includes(muscle) || 
    exercise.secondaryMuscles.includes(muscle)
  );
};

// Helper function to get exercises by category
export const getExercisesByCategory = (category: string) => {
  return exercises.filter(exercise => exercise.category === category);
};

// Helper function to get exercises by equipment
export const getExercisesByEquipment = (equipment: string) => {
  return exercises.filter(exercise => exercise.equipment === equipment);
}; 