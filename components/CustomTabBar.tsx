import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const tabRoutes = [
  { name: "index", icon: "home", activeIcon: "home" },
  { name: "history", icon: "calendar-outline", activeIcon: "calendar" },
  { name: "add", icon: "add-circle" },
  { name: "notifications", icon: "notifications-outline", activeIcon: "notifications" },
  { name: "profile", icon: "person-outline", activeIcon: "person" },
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
          const isAddButton = tab.name === "add";

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              className="flex-1 items-center justify-center"
            >
              <Ionicons
                name={(isAddButton ? tab.icon : isFocused ? tab.activeIcon : tab.icon) as any}
                size={isAddButton ? 40 : 28}
                color={ isFocused ? "#bf5700" : "#888"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
