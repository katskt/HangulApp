import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Dimensions } from "react-native";

type SplashTemplateProps = {
  topContent?: React.ReactNode; // Content over the whiteSplash
  bottomContent?: React.ReactNode; // Content over the Color.background
  topHeightRatio?: number; // Fraction of screen for top (default 1/3)
};

import { useThemeColors } from "../theme/useThemeColors";

export default function SplashTemplate({
  topContent,
  bottomContent,
  topHeightRatio = 0.4,
}: SplashTemplateProps) {
  const colors = useThemeColors();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const styles = StyleSheet.create({
    image: {
      width: "100%",
      height: SCREEN_HEIGHT * 0.4,
      zIndex: 1,
      position: "absolute",
    },

    container: {
      flex: 1,
      position: "relative",
    },
    top: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    topContent: {
      zIndex: 1,
      /*       justifyContent: "center",
      alignItems: "center", commented out, lets see if this breaks anything*/
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
        <Image
          source={require("../assets/images/whiteSplash.png")}
          style={styles.image}
          resizeMode="cover"
        />
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
