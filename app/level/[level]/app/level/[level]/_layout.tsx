import { Stack } from "expo-router";
import { useThemeColors } from "@/theme/useThemeColors";

export default function LevelLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
