import { useThemeColors } from "@/theme/useThemeColors";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function ProgressBar({
  currentQuestionNumber,
  totalQuizNumber,
}: {
  currentQuestionNumber: number;
  totalQuizNumber: number;
}) {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    progressContainer: {
      height: 12,
      backgroundColor: colors.unselect,
      borderRadius: 6,
      margin: 16,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.select,
      borderRadius: 6,
    },
  });

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: currentQuestionNumber / totalQuizNumber,
      duration: 300,
      useNativeDriver: false, // must be false for width
    }).start();
  }, [currentQuestionNumber]);

  return (
    <View style={styles.progressContainer}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: animatedProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}
