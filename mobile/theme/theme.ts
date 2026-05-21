// theme.ts
import { ColorValue } from "react-native";

export type ColorScheme = "light" | "dark";

export interface ThemeColors {
  background: ColorValue;
  foreground: ColorValue;
  text: ColorValue;
  tint: ColorValue;
  select: ColorValue;
  unselect: ColorValue;
  button: ColorValue;
  buttonText: ColorValue;
  navBar: ColorValue;
  incomplete: ColorValue;
  complete: ColorValue;
  tabBar: ColorValue;
}

export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: "#f8fffd",
    foreground: "#ffffff",
    text: "#000",
    tint: "#d5d5d5",
    select: "#4c4c4c",
    unselect: "rgb(236, 236, 255)",
    button: "#FFFDF7",
    buttonText: "#000",
    navBar: "#FFFDF7",
    incomplete: "#FFFDF7",
    complete: "#AAFF9C",
    tabBar: "#FFFDF7",
  },
  dark: {
    background: "#256a56",
    foreground: "#ffffff",
    text: "#ffffff",
    tint: "rgb(214, 214, 214)",
    select: "#71b4ff",
    unselect: "rgb(236, 236, 255)",
    button: "#FFFDF7",
    buttonText: "#000",
    navBar: "#FFFDF7",
    incomplete: "#FFFDF7",
    complete: "#AAFF9C",
    tabBar: "#FFFDF7",
  },
};
