import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Animation values
  const pageAnimationProgress = useSharedValue(1); // Set to 1 to show content immediately

  const contentStyle = useAnimatedStyle(() => ({
    opacity: pageAnimationProgress.value,
    transform: [
      { translateY: withSpring((1 - pageAnimationProgress.value) * 50, { damping: 15 }) },
    ],
  }));

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert('Success', 'Please check your email for verification');
      } else {
        await signIn(email, password);
        Alert.alert('Success', 'Sign in successful, navigating to home');
        router.replace('/');
      }
    } catch (error: any) {
      Alert.alert('Error', `Authentication error: ${error.message || 'An error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View 
        style={contentStyle}
        className="flex-1 justify-center px-8"
      >
        {/* Header */}
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text className="text-base text-gray-600 text-center">
            {isSignUp 
              ? 'Sign up to start tracking your fitness journey'
              : 'Sign in to continue your fitness journey'
            }
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900"
            />
          </View>
          <View>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              secureTextEntry
              className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900"
            />
          </View>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || authLoading}
            className={`${isLoading || authLoading ? 'bg-gray-400' : 'bg-ut_orange'} rounded-xl py-4 items-center`}
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading || authLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
            }}
            className="items-center py-4"
          >
            <Text className="text-gray-600">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
} 