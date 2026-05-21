import { FontSizes, FontWeights } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
  Text,
} from "react-native";
type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

const MyButton = ({
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  children,
  color,
  style,
}: ButtonProps) => {
  const colors = useThemeColors();
  const { hp, wp } = useResponsive();
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: wp(1),
      borderColor: colors.tint,
      elevation: 3,
      margin: 10,
      borderRadius: 10,
    },
    buttonPressed: {
      opacity: 0.7,
    },
  });
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color || "#FFF" },
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};

export default MyButton;
