import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { ExternalPathString, RelativePathString, useRouter } from "expo-router";
type buttonProps = {
  title?: string;
  background?: string; // Content over the Color.background
  fill?: string; // Fraction of screen for top (default 1/3)
  target?: string;
};

import { useThemeColors } from "../theme/useThemeColors";
import { FontSizes, FontWeights } from "@/theme/typography";

export default function SmallButton({ title, fill, target }: buttonProps) {
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
    },
  });

  return (
    <TouchableOpacity
      onPress={() => router.push(target)}
      style={[styles.container, { backgroundColor: fill }]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}
