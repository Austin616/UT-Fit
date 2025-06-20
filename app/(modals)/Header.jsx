import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, usePathname } from 'expo-router';
import { ChevronLeft, Timer, Bookmark, Image, Share, Save } from 'lucide-react-native';

function ModalHeader() {
  const navigation = useNavigation();
  const pathname = usePathname();
  const isLogPage = pathname === '/log';

  return (
    <SafeAreaView edges={['top']} className="bg-gray-100">
      <View className="flex-row items-center justify-between px-4 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <ChevronLeft size={24} color="#bf5700" />
            <Text className="text-lg font-semibold text-ut_orange">Back</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-5">
          {isLogPage ? (
            // Log page icons
            <>
              <TouchableOpacity>
                <Timer size={20} color="black" strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Bookmark size={20} color="black" strokeWidth={1.5} />
              </TouchableOpacity>
            </>
          ) : (
            // Post page icons
            <>
              <TouchableOpacity>
                <Image size={20} color="black" strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Share size={20} color="black" strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Save size={20} color="black" strokeWidth={1.5} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Memoize the header to prevent unnecessary re-renders
export default memo(ModalHeader);
