import React from "react";
import { View, StyleSheet } from "react-native";

import { useThemeColors } from "@/theme/useThemeColors";

type SplashTemplateProps = {
  topContent?: React.ReactNode; // Content over the whiteSplash
  bottomContent?: React.ReactNode; // Content over the Color.background
  topHeightRatio?: number; // Fraction of screen for top (default 1/3)
};

export default function SplashTemplate({
  topContent,
  bottomContent,
  topHeightRatio = 0.1,
}: SplashTemplateProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },
    top: {
      position: "relative",
      backgroundColor: colors.background,
      alignItems: "center",
    },
    topContent: {
      zIndex: 1,
      width: "90%",
    },
    bottom: {
      position: "relative",
      backgroundColor: colors.background,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    bottomContent: {
      width: "90%",
    },
  });

  return (
    <View style={styles.container}>
      {/* Top Splash Section */}
      <View style={[styles.top, { flex: topHeightRatio }]}>
        <View style={styles.topContent}>
          {
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {topContent}
            </View>
          }
        </View>
      </View>

      {/* Bottom Background Section */}
      <View style={[styles.bottom, { flex: 1 - topHeightRatio }]}>
        <View style={styles.bottomContent}>{bottomContent}</View>
      </View>
    </View>
  );
}
