import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import CustomTabBar from "../components/CustomTabBar";
import Header from "../components/Header";
import "../global.css";

export default function AppLayout() {
  return (
    <View className="flex-1">
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
} 