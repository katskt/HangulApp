import { Tabs } from "expo-router";
import { useThemeColors } from "@/theme/useThemeColors";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint as string,
        tabBarInactiveTintColor: colors.text as string,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
        },
        tabBarItemStyle: { flex: 1, justifyContent: "center" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="level/[level]/index"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="level/[level]/consonant/index"
        options={{
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="level/[level]/vowel/index"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="level/[level]/consonant/[consonantId]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="level/[level]/vowel/[vowelId]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="level/[level]/practice/index"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="level/[level]/quiz/[quizId]/A"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="level/[level]/quiz/[quizId]/B"
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
