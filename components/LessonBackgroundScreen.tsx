import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import MyButton from "./FunctionalButton";
type SplashTemplateProps = {
  topContent?: React.ReactNode; // Content over the whiteSplash
  bottomContent?: React.ReactNode; // Content over the Color.background
  topHeightRatio?: number; // Fraction of screen for top (default 1/3)
};

import { useThemeColors } from "../theme/useThemeColors";

export default function HalfSplashTemplate({
  topContent,
  bottomContent,
  topHeightRatio = 0.2,
}: SplashTemplateProps) {
  const colors = useThemeColors();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const styles = StyleSheet.create({
    image: {
      width: "100%",
      height: SCREEN_HEIGHT * 0.4,
      zIndex: 0,
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
      padding: 20,
      paddingTop: 45,
      /* justifyContent: "center",
      alignItems: "center",  */ //commented out, lets see if this breaks anything*/
    },
    bottom: {
      position: "relative",
      backgroundColor: colors.background,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 20,
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
          source={require("../assets/images/halfWhiteSplash.png")}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.topContent}>
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
        </View>
      </View>

      {/* Bottom Background Section */}
      <View style={[styles.bottom, { flex: 1 - topHeightRatio }]}>
        <View style={styles.bottomContent}>{bottomContent}</View>
      </View>
    </View>
  );
}
