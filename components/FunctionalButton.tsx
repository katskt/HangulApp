import { FontSizes, FontWeights } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
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
  const { wp, hp } = useResponsive();
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: wp(1),
      borderColor: colors.tint,
      elevation: 3, // Android shadow
      margin: 10,
      borderRadius: 10,
    },
    buttonPressed: {
      // Dim the button slightly when pressed
      opacity: 0.7,
    },
    text: {
      fontSize: FontSizes.header,
      lineHeight: 0,
      fontWeight: FontWeights.semibold,
      letterSpacing: 0.25,
      color: "#000", // Text is always white for a standard button look
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
