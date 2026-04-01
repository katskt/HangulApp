import { useThemeColors } from "@/theme/useThemeColors";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const colors = useThemeColors();
  const [fontsLoaded] = useFonts({
    Jua: require("@/assets/fonts/Jua/Jua-Regular.ttf"),
    AsapCondensedSemiBold: require("@/assets/fonts/AsapCondensed/AsapCondensed-SemiBold.ttf"),
    AsapCondensedBold: require("@/assets/fonts/AsapCondensed/AsapCondensed-Bold.ttf"),
  });
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
