import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
  } from 'react-native';
  import { useState, useCallback } from 'react';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import {
    Dumbbell,
    Calendar,
    Clock,
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Search,
    Users,
    Compass,
  } from 'lucide-react-native';
  import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    Easing,
  } from 'react-native-reanimated';
  import { useFocusEffect } from '@react-navigation/native';
  
  // Mock data for social feed (same as home page)
  const SOCIAL_FEED = [
    {
      id: '1',
      user: {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        isFollowing: true
      },
      workout: {
        name: 'Morning Push Day',
        date: '2024-03-10',
        duration: '45 min',
        exercises: ['Bench Press', 'Shoulder Press', 'Tricep Extensions'],
        progress: '+5 lbs on bench'
      },
      caption: 'Starting the week strong 💪 Hit a new PR on bench press!',
      likes: 124,
      comments: 8,
      images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e']
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Sarah Wilson',
        username: 'sarahfitness',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        isFollowing: false
      },
      workout: {
        name: 'Full Body HIIT',
        date: '2024-03-09',
        duration: '30 min',
        exercises: ['Burpees', 'Mountain Climbers', 'Jump Rope'],
        progress: 'Reduced rest time by 15s'
      },
      caption: 'Quick HIIT session to start the day! Who else loves morning workouts? 🌅',
      likes: 89,
      comments: 5,
      images: ['https://images.unsplash.com/photo-1549576490-b0b4831ef60a']
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Mike Johnson',
        username: 'mikefitness',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        isFollowing: true
      },
      workout: {
        name: 'Back Day',
        date: '2024-03-08',
        duration: '50 min',
        exercises: ['Pull-ups', 'Barbell Rows', 'Face Pulls'],
        progress: 'Added 2 reps to pull-ups'
      },
      caption: 'Focus on form over weight. Quality over quantity always! 💯',
      likes: 156,
      comments: 12,
      images: ['https://images.unsplash.com/photo-1544033527-b192daee1f5b']
    }
  ];
  
  type FeedType = 'friends' | 'explore';
  
  export default function SocialScreen() {
    const [feedType, setFeedType] = useState<FeedType>('friends');
    const [refreshing, setRefreshing] = useState(false);
  
    // Animation values
    const pageAnimationProgress = useSharedValue(0);
    const filterScale = useSharedValue(1);
  
    useFocusEffect(
      useCallback(() => {
        // Reset animations
        pageAnimationProgress.value = 0;
  
        // Start animations
        pageAnimationProgress.value = withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        });
  
        return () => {
          // Reset animations when screen loses focus
          pageAnimationProgress.value = 0;
        };
      }, [])
    );
  
    const contentStyle = useAnimatedStyle(() => ({
      opacity: pageAnimationProgress.value,
      transform: [
        { translateY: withSpring((1 - pageAnimationProgress.value) * 50, { damping: 15 }) },
      ],
    }));
  
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      // Simulate refresh
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }, []);
  
    const renderSocialPost = (post: typeof SOCIAL_FEED[0], index: number) => (
      <Animated.View
        key={post.id}
        entering={FadeInDown.delay(index * 100).springify()}
        className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Post Header */}
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: post.user.avatar }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="font-semibold text-gray-900">{post.user.name}</Text>
              <Text className="text-gray-500 text-sm">@{post.user.username}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            {!post.user.isFollowing && (
              <TouchableOpacity
                className="bg-ut_orange rounded-full px-4 py-1.5 mr-3"
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">Follow</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity>
              <MoreHorizontal size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Workout Details */}
        <View className="px-4 py-2 border-y border-gray-100">
          <View className="flex-row items-center mb-2">
            <Dumbbell size={18} color="#bf5700" />
            <Text className="text-lg font-semibold ml-2">{post.workout.name}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <View className="flex-row items-center mr-4">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{post.workout.date}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{post.workout.duration}</Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {post.workout.exercises.map((exercise, i) => (
              <View 
                key={i} 
                className="bg-gray-50 px-3 py-1 rounded-full"
              >
                <Text className="text-gray-700 text-sm">{exercise}</Text>
              </View>
            ))}
          </View>
        </View>
  
        {/* Post Image */}
        {post.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            className="w-full aspect-square"
            resizeMode="cover"
          />
        ))}
  
        {/* Post Actions */}
        <View className="p-4">
          <View className="flex-row items-center mb-3">
            <TouchableOpacity className="flex-row items-center mr-6">
              <Heart size={24} color="#6B7280" />
              <Text className="ml-2 text-gray-600">{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center mr-6">
              <MessageCircle size={24} color="#6B7280" />
              <Text className="ml-2 text-gray-600">{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Share2 size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
  
          {/* Caption */}
          <Text className="text-gray-900">
            <Text className="font-semibold">{post.user.username}</Text>
            {' '}{post.caption}
          </Text>
        </View>
      </Animated.View>
    );
  
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
        {/* Search Bar */}
        <Animated.View 
          entering={FadeInDown.springify()}
          className="px-4 py-2"
        >
          <TouchableOpacity 
            className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2"
            activeOpacity={0.7}
          >
            <Search size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-500">Search workouts and users...</Text>
          </TouchableOpacity>
        </Animated.View>
  
        {/* Feed Type Selector */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="flex-row px-4 py-2"
        >
          <TouchableOpacity
            onPress={() => setFeedType('friends')}
            className={`flex-row items-center mr-6 pb-2 ${
              feedType === 'friends' ? 'border-b-2 border-ut_orange' : ''
            }`}
          >
            <Users size={20} color={feedType === 'friends' ? '#bf5700' : '#6B7280'} />
            <Text
              className={`ml-2 font-medium ${
                feedType === 'friends' ? 'text-ut_orange' : 'text-gray-600'
              }`}
            >
              Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFeedType('explore')}
            className={`flex-row items-center pb-2 ${
              feedType === 'explore' ? 'border-b-2 border-ut_orange' : ''
            }`}
          >
            <Compass size={20} color={feedType === 'explore' ? '#bf5700' : '#6B7280'} />
            <Text
              className={`ml-2 font-medium ${
                feedType === 'explore' ? 'text-ut_orange' : 'text-gray-600'
              }`}
            >
              Explore
            </Text>
          </TouchableOpacity>
        </Animated.View>
  
        {/* Feed */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {SOCIAL_FEED.map((post, index) => renderSocialPost(post, index))}
          <View className="h-4" />
        </ScrollView>
      </SafeAreaView>
    );
  }