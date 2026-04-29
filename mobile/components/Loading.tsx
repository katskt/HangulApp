import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type LoadingProps = {
  style?: StyleProp<ViewStyle>;
};

export default function Loading(style: LoadingProps) {
  const spin = useRef(new Animated.Value(0)).current;
  const { wp, hp } = useResponsive();
  const colors = useThemeColors();
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      zIndex: 10,
    },
    image: {
      width: wp(50),
      height: wp(50),
      borderRadius: wp(50),
      resizeMode: "contain",
    },
  });

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container]}>
      <Animated.Image
        source={require("@/assets/images/storke.png")}
        style={[styles.image, { transform: [{ rotate }] }]}
      />
    </View>
  );
}
