-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  categories TEXT[] NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_id UUID REFERENCES workouts ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  order_in_workout INTEGER NOT NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  primary_muscles TEXT[] DEFAULT '{}',
  secondary_muscles TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'strength',
  equipment TEXT DEFAULT '',
  force TEXT DEFAULT '',
  mechanic TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sets table
CREATE TABLE IF NOT EXISTS sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exercise_id UUID REFERENCES exercises ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) DEFAULT 0,
  reps INTEGER DEFAULT 0,
  order_in_exercise INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  exercise_id TEXT NOT NULL, -- References exercise.id from the exercises constant
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, exercise_id) -- Prevent duplicate favorites
);

-- Enable Row Level Security
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can view their own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can update their own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can delete their own workouts" ON workouts;

DROP POLICY IF EXISTS "Users can insert exercises for their workouts" ON exercises;
DROP POLICY IF EXISTS "Users can view exercises for their workouts" ON exercises;
DROP POLICY IF EXISTS "Users can update exercises for their workouts" ON exercises;
DROP POLICY IF EXISTS "Users can delete exercises for their workouts" ON exercises;

DROP POLICY IF EXISTS "Users can insert sets for their exercises" ON sets;
DROP POLICY IF EXISTS "Users can view sets for their exercises" ON sets;
DROP POLICY IF EXISTS "Users can update sets for their exercises" ON sets;
DROP POLICY IF EXISTS "Users can delete sets for their exercises" ON sets;

DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

-- Create RLS policies for workouts table
CREATE POLICY "Users can insert their own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can update their own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for exercises table
CREATE POLICY "Users can insert exercises for their workouts" ON exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view exercises for their workouts" ON exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = exercises.workout_id 
      AND (workouts.user_id = auth.uid() OR workouts.is_public = true)
    )
  );

CREATE POLICY "Users can update exercises for their workouts" ON exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete exercises for their workouts" ON exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

-- Create RLS policies for sets table
CREATE POLICY "Users can insert sets for their exercises" ON sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM exercises 
      JOIN workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = sets.exercise_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sets for their exercises" ON sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exercises 
      JOIN workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = sets.exercise_id 
      AND (workouts.user_id = auth.uid() OR workouts.is_public = true)
    )
  );

CREATE POLICY "Users can update sets for their exercises" ON sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM exercises 
      JOIN workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = sets.exercise_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sets for their exercises" ON sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM exercises 
      JOIN workouts ON workouts.id = exercises.workout_id
      WHERE exercises.id = sets.exercise_id 
      AND workouts.user_id = auth.uid()
    )
  );

-- Create RLS policies for favorites table
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" ON favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON workouts(created_at);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_exercise_id ON favorites(exercise_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_exercise ON favorites(user_id, exercise_id); 