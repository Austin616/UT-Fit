import { Text, SafeAreaView, View, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';

export default function Settings() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log out');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Settings</Text>
        
        {/* Settings sections will go here */}
        <View className="flex-1">
          <Text className="text-gray-500 mb-4">More settings coming soon...</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-500 rounded-xl py-4 px-6 mb-6"
          activeOpacity={0.7}
        >
          <LogOut size={24} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-lg ml-2">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}