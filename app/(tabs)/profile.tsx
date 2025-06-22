import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid, List, Edit3, Settings, Trophy, Map, MessageCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, Layout } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = SCREEN_WIDTH / 3;

// Mock data - replace with real data later
const MOCK_POSTS = [
  { id: '1', image: 'https://picsum.photos/300', workoutName: 'Morning Push Day' },
  { id: '2', image: 'https://picsum.photos/301', workoutName: 'Leg Day' },
  { id: '3', image: 'https://picsum.photos/302', workoutName: 'Back & Biceps' },
  { id: '4', image: 'https://picsum.photos/303', workoutName: 'Cardio Session' },
  { id: '5', image: 'https://picsum.photos/304', workoutName: 'Full Body' },
  { id: '6', image: 'https://picsum.photos/305', workoutName: 'Core Workout' },
];

type ViewMode = 'grid' | 'list';

export default function ProfileScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const renderGridItem = ({ item, index }: { item: typeof MOCK_POSTS[0], index: number }) => (
    <Animated.View 
      entering={FadeIn.delay(index * 100)}
      layout={Layout.springify()}
    >
      <TouchableOpacity 
        className="relative"
        style={{ width: GRID_SIZE, height: GRID_SIZE }}
      >
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          style={{ borderWidth: 0.5, borderColor: '#fff' }}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderListItem = ({ item, index }: { item: typeof MOCK_POSTS[0], index: number }) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100)}
      layout={Layout.springify()}
      className="px-4 py-3 border-b border-gray-100"
    >
      <TouchableOpacity>
        <Text className="text-lg text-gray-900">{item.workoutName}</Text>
        <Text className="text-sm text-gray-500 mt-1">Posted 2 days ago</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View className="p-4">
          <View className="flex-row items-center">
            {/* Profile Picture */}
            <TouchableOpacity>
              <View className="relative">
                <Image
                  source={{ uri: 'https://picsum.photos/200' }}
                  className="w-20 h-20 rounded-full"
                />
                <View className="absolute bottom-0 right-0 bg-ut_orange rounded-full w-6 h-6 items-center justify-center border-2 border-white">
                  <Edit3 size={14} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Stats */}
            <View className="flex-1 flex-row justify-around ml-4">
              <TouchableOpacity className="items-center">
                <Text className="text-lg font-bold">{MOCK_POSTS.length}</Text>
                <Text className="text-gray-600">Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <Text className="text-lg font-bold">248</Text>
                <Text className="text-gray-600">Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <Text className="text-lg font-bold">186</Text>
                <Text className="text-gray-600">Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio */}
          <View className="mt-3">
            <Text className="font-semibold">Austin Tran</Text>
            <Text className="text-gray-600">🏋️‍♂️ Fitness Enthusiast</Text>
            <Text className="text-gray-600">💪 Sharing my fitness journey</Text>
            <Text className="text-gray-600">🎓 UT Austin &apos;24</Text>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity 
            className="mt-3 py-1.5 rounded-lg bg-gray-100"
          >
            <Text className="text-center font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* View Toggle */}
        <View className="flex-row border-t border-gray-200 mt-4">
          <TouchableOpacity
            onPress={() => setViewMode('grid')}
            className={`flex-1 items-center py-2.5 ${viewMode === 'grid' ? 'border-b-2 border-ut_orange' : ''}`}
          >
            <Grid size={22} color={viewMode === 'grid' ? '#bf5700' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`flex-1 items-center py-2.5 ${viewMode === 'list' ? 'border-b-2 border-ut_orange' : ''}`}
          >
            <List size={22} color={viewMode === 'list' ? '#bf5700' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Posts */}
        {viewMode === 'grid' ? (
          <FlatList
            data={MOCK_POSTS}
            renderItem={renderGridItem}
            keyExtractor={item => item.id}
            numColumns={3}
            scrollEnabled={false}
            className="bg-white"
          />
        ) : (
          <View>
            {MOCK_POSTS.map((post, index) => (
              <View key={post.id}>
                {renderListItem({ item: post, index })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 