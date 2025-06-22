import { memo } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, MessageCircle, Map, Settings, Edit3, Bell } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const renderLeftSide = () => {
    if (pathname === '/profile') {
      return (
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">austintran</Text>
        </View>
      );
    }

    return (
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image 
            source={require('../assets/image.png')} 
            className="w-10 h-10" 
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const getHeaderIcons = () => {
    switch (pathname) {
      case '/':
        return (
          <>
            <TouchableOpacity onPress={() => router.push('/map')}>
              <Map size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/achievements')}>
              <Trophy size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/messages')}>
              <MessageCircle size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
          </>
        );
      
      case '/profile':
        return (
          <>
            <TouchableOpacity onPress={() => router.push('/achievements')}>
              <Trophy size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/messages')}>
              <MessageCircle size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Settings size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
          </>
        );

      case '/history':
        return (
          <>
            <TouchableOpacity onPress={() => router.push('/achievements')}>
              <Trophy size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/messages')}>
              <MessageCircle size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
          </>
        );

      case '/notifications':
        return (
          <>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Settings size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
          </>
        );

      case '/settings':
        return (
          <>
            <TouchableOpacity onPress={() => router.push('/edit-profile')}>
              <Edit3 size={24} color="black" strokeWidth={1.5} />
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  // Don't show header on modal screens
  if (pathname.startsWith('/(modals)')) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} className="bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between px-4 pb-4">
        {renderLeftSide()}
        <View className="flex-row items-center gap-5">
          {getHeaderIcons()}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Memoize the header to prevent unnecessary re-renders
export default memo(Header);