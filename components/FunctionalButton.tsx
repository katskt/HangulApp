import React from "react";
import { Pressable, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { FontSizes, FontWeights } from "@/theme/typography";

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  width?: number;
  style?: string;
};

const MyButton = ({
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  children,
  color,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        // Apply the custom color if provided, otherwise a default
        { backgroundColor: color || "#FFF" },
        // Visual feedback for when the button is pressed
        pressed && styles.buttonPressed,
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 40,
    elevation: 3, // Android shadow
    marginVertical: 10,
    minHeight: 80,
    margin: 10,
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

export default MyButton;
