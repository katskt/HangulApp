import { Tabs } from "expo-router";
import { useThemeColors } from "../theme/useThemeColors";

export default function Layout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint as string,
        tabBarInactiveTintColor: colors.text as string,
        tabBarStyle: { backgroundColor: colors.tabBar },
      }}
    />
  );
}
