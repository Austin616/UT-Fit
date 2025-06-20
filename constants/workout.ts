export const WORKOUT_CATEGORIES = [
  'Strength',
  'Cardio',
  'HIIT',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Bodyweight',
  'Olympic Lifting',
  'Powerlifting',
  'Recovery',
  'Mobility',
  'Sports Training'
] as const;

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Full Body',
  'Lower Body',
  'Upper Body'
] as const;

// Default cover images for different workout types
export const DEFAULT_WORKOUT_IMAGES = {
  Strength: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
  Cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c',
  HIIT: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e',
  Yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  Pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
  CrossFit: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5',
  Bodyweight: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
  'Olympic Lifting': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
  Powerlifting: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5',
  Recovery: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  Mobility: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4',
  'Sports Training': 'https://images.unsplash.com/photo-1526676037777-05a232554f77'
} as const;

export type WorkoutCategory = typeof WORKOUT_CATEGORIES[number];
export type MuscleGroup = typeof MUSCLE_GROUPS[number]; 