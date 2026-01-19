// theme.ts
import { ColorValue } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  background: ColorValue;
  foreground: ColorValue;
  text: ColorValue;
  tint: ColorValue;
  button: ColorValue;
  buttonText: ColorValue;
  navBar: ColorValue;
  incomplete: ColorValue;
  complete: ColorValue;
  tabBar: ColorValue;

}

export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#E5F3EF',
    foreground: '#FFF9E7',
    text: '#000',
    tint: '#007AFF',
    button: '#FFFDF7',
    buttonText: '#000',
    navBar: '#FFFDF7',
    incomplete: '#FFFDF7',
    complete: '#AAFF9C',
    tabBar: '#FFFDF7',
  },
  dark: {
    background: '#E5F3EF',
    foreground: '#FFF9E7',
    text: '#000',
    tint: '#0af',
    button: '#FFFDF7',
    buttonText: '#000',
    navBar: '#FFFDF7',
    incomplete: '#FFFDF7',
    complete: '#AAFF9C',
    tabBar: '#FFFDF7',

  },
};
