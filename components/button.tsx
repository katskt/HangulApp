import { useResponsive } from "@/utils/responsive";
import { RelativePathString, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
type buttonProps = {
  title?: string;
  background?: string; // Content over the Color.background
  fill?: string; // Fraction of screen for top (default 1/3)
  target?: string;
};

import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";

export default function Button({
  title,
  background,
  fill,
  target,
}: buttonProps) {
  const { wp, hp } = useResponsive();
  const router = useRouter();
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    title: {
      fontSize: FontSizes.header,
      fontWeight: FontWeights.semibold,
      padding: 15,
    },
    background: {
      fontSize: FontSizes.huge,
      backgroundColor: colors.button,
      margin: -10,
      textAlign: "center",
    },
    container: {
      height: hp(10),
      margin: 10,
      position: "relative",
      borderRadius: 10,
      overflow: "hidden",
    },
  });

  return (
    <TouchableOpacity
      onPress={() => router.push(target as RelativePathString)}
      style={[styles.container, { backgroundColor: fill }]}
    >
      <Text style={[styles.title, { fontFamily: Typography.english }]}>
        {title}
      </Text>
      <Text style={styles.background}>{background}</Text>
    </TouchableOpacity>
  );
}
