import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Compass, PlusCircle, Calendar, User } from "lucide-react-native";

const tabRoutes = [
  { name: "index", icon: "home", activeIcon: "home" },
  { name: "explore", icon: "compass", activeIcon: "compass" },
  { name: "add", icon: "plus-circle", activeIcon: "plus-circle" },
  { name: "history", icon: "calendar", activeIcon: "calendar" },
  { name: "profile", icon: "user", activeIcon: "user" },
];

export default function CustomTabBar({
  state,
  navigation,
}: {
  state: any;
  navigation: any;
}) {
  return (
    <SafeAreaView edges={["bottom"]} className="bg-white">
      <View className="flex-row justify-around items-center pt-4 border-t border-gray-200">
          {tabRoutes.map((tab) => {
            const isFocused = state.routes[state.index].name === tab.name;

            return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              className="flex-1 items-center justify-center"
            >
              {tab.name === "index" && (
                <Home size={24} color={isFocused ? "#bf5700" : "#6B7280"} />
              )}
              {tab.name === "explore" && (
                <Compass size={24} color={isFocused ? "#bf5700" : "#6B7280"} />
              )}
              {tab.name === "add" && (
                <PlusCircle size={24} color={isFocused ? "#bf5700" : "#6B7280"} />
              )}
              {tab.name === "history" && (
                <Calendar size={24} color={isFocused ? "#bf5700" : "#6B7280"} />
              )}
              {tab.name === "profile" && (
                <User size={24} color={isFocused ? "#bf5700" : "#6B7280"} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
