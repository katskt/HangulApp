import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  return {
    wp: (percent: number) => width * (percent / 100), // wp(50) = 50% of width
    hp: (percent: number) => height * (percent / 100), // hp(20) = 20% of height
  };
}
