import Colors from "@/constants/Colors";
import { themeAtom } from "@/store/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAtomValue } from "jotai";

export default function TabLayout() {
  const theme = useAtomValue(themeAtom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarStyle: {
          backgroundColor: Colors[theme].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
