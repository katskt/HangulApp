import { RelativePathString, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
type buttonProps = {
  children: React.ReactNode;
  background?: string; // Content over the Color.background
  fill?: string; // Fraction of screen for top (default 1/3)
  target?: string;
};

import { FontSizes, FontWeights } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";

export default function SmallButton({ children, fill, target }: buttonProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    title: {
      fontSize: FontSizes.header,
      padding: 15,
      textAlign: "center",
      fontWeight: FontWeights.bold,
    },
    background: {
      fontSize: FontSizes.huge,
      margin: -10,
      opacity: 0.1,
      textAlign: "center",
    },
    container: {
      height: 130,
      margin: 10,
      marginVertical: 20,
      position: "relative",
      borderRadius: 40,
      overflow: "hidden",
      justifyContent: "center", // Vertical centering
      alignItems: "center",
      borderWidth: 5,
      borderColor: colors.tint,
    },
  });

  return (
    <TouchableOpacity
      onPress={() => router.push(target as RelativePathString)}
      style={[styles.container, { backgroundColor: fill }]}
    >
      {children}
    </TouchableOpacity>
  );
}
