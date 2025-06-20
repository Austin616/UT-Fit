import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

export default function AddLanding() {
  const router = useRouter();
  const navigation = useNavigation();
  const animationProgress = useSharedValue(0);

  // Animation values for each card
  const quickLogScale = useSharedValue(1);
  const createPostScale = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      // Reset and start animations when screen comes into focus
      animationProgress.value = 0;
      quickLogScale.value = 0.8;
      createPostScale.value = 0.8;

      // Animate the progress
      animationProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });

      // Animate the cards
      quickLogScale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });

      // Delay the second card animation
      setTimeout(() => {
        createPostScale.value = withSpring(1, {
          damping: 15,
          stiffness: 100,
        });
      }, 100);

      return () => {
        // Reset animations when screen loses focus
        animationProgress.value = 0;
        quickLogScale.value = 0.8;
        createPostScale.value = 0.8;
      };
    }, [ animationProgress, quickLogScale, createPostScale])
  );

  const titleStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
    transform: [
      { translateY: withSpring(animationProgress.value * 0, { damping: 15 }) },
    ],
  }));

  const quickLogStyle = useAnimatedStyle(() => ({
    transform: [{ scale: quickLogScale.value }],
  }));

  const createPostStyle = useAnimatedStyle(() => ({
    transform: [{ scale: createPostScale.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <View className="flex-1 px-6 justify-center">
        <Animated.View style={titleStyle}>
          <Text className="text-2xl font-bold mb-8 text-center">What would you like to do?</Text>
        </Animated.View>

        <Animated.View style={quickLogStyle}>
          <TouchableOpacity
            onPress={() => router.push('/log')}
            className="flex-row items-center bg-ut_orange p-6 rounded-2xl mb-4"
          >
            <View className="bg-white/20 p-3 rounded-xl mr-4">
              <Ionicons name="barbell-outline" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-semibold mb-1">Quick Log</Text>
              <Text className="text-white/80">Privately log your workout</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={createPostStyle}>
          <TouchableOpacity
            onPress={() => router.push('/post')}
            className="flex-row items-center bg-gray-900 p-6 rounded-2xl"
          >
            <View className="bg-white/20 p-3 rounded-xl mr-4">
              <Ionicons name="share-social-outline" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-semibold mb-1">Create Post</Text>
              <Text className="text-white/80">Share your workout with others</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}