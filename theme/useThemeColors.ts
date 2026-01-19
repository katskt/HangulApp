import { Colors, ColorScheme } from "./theme";
import { useColorScheme } from "react-native";

export function useThemeColors() {
    const scheme = useColorScheme() as ColorScheme;
    return Colors[scheme?? 'light'];
}