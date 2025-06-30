import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, Clock, TrendingUp, Zap } from 'lucide-react-native';
import BaseModalScreen from './BaseModalScreen';

interface WorkoutStatsScreenProps {
  visible: boolean;
  onClose: () => void;
  workoutData?: {
    totalWorkouts: number;
    totalMinutes: number;
    currentStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
  };
}

export default function WorkoutStatsScreen({
  visible,
  onClose,
  workoutData = {
    totalWorkouts: 0,
    totalMinutes: 0,
    currentStreak: 0,
    weeklyGoal: 3,
    weeklyProgress: 1
  }
}: WorkoutStatsScreenProps) {
  const stats = [
    {
      icon: Calendar,
      label: 'Total Workouts',
      value: workoutData.totalWorkouts.toString(),
      color: '#F97316'
    },
    {
      icon: Clock,
      label: 'Total Minutes',
      value: workoutData.totalMinutes.toLocaleString(),
      color: '#3B82F6'
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: `${workoutData.currentStreak} days`,
      color: '#10B981'
    },
    {
      icon: TrendingUp,
      label: 'Weekly Progress',
      value: `${workoutData.weeklyProgress}/${workoutData.weeklyGoal}`,
      color: '#8B5CF6'
    }
  ];

  return (
    <BaseModalScreen
      visible={visible}
      onClose={onClose}
      title="Workout Stats"
      maxHeight="70%"
    >
      <View className="space-y-4">
        {/* Stats Grid */}
        <View className="flex-row flex-wrap gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View
                key={index}
                className="flex-1 min-w-[45%] bg-gray-50 rounded-2xl p-4"
              >
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                    <IconComponent size={20} color={stat.color} />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {stat.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Weekly Progress Bar */}
        <View className="bg-gray-50 rounded-2xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            This Week's Goal
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-600">
              {workoutData.weeklyProgress} of {workoutData.weeklyGoal} workouts
            </Text>
            <Text className="text-gray-600">
              {Math.round((workoutData.weeklyProgress / workoutData.weeklyGoal) * 100)}%
            </Text>
          </View>
          <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-ut_orange rounded-full"
              style={{ 
                width: `${Math.min((workoutData.weeklyProgress / workoutData.weeklyGoal) * 100, 100)}%` 
              }}
            />
          </View>
        </View>

        {/* Motivational Message */}
        <View className="bg-ut_orange/10 rounded-2xl p-4">
          <Text className="text-ut_orange font-semibold text-center">
            {workoutData.currentStreak > 0 
              ? `🔥 You're on fire! ${workoutData.currentStreak} day streak!`
              : "💪 Ready to start your fitness journey?"
            }
          </Text>
        </View>
      </View>
    </BaseModalScreen>
  );
} 