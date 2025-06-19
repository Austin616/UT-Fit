import { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, MessageCircle, Map } from 'lucide-react-native';
import Logo from '../assets/image.png'

function Header() {
  return (
    <SafeAreaView edges={['top']} className="bg-gray-100">
      <View className="flex-row items-center justify-between px-4 pb-4">
        <View className="flex-row items-center">
            <Image source={Logo} className="w-12 h-12" />
        </View>
        <View className="flex-row items-center gap-5">
          <TouchableOpacity>
            <Map size={24} color="black" strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Trophy size={24} color="black" strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MessageCircle size={24} color="black" strokeWidth={1.5} />
          </TouchableOpacity>
            </View>
      </View>
    </SafeAreaView>
  );
}

// Memoize the header to prevent unnecessary re-renders
export default memo(Header);