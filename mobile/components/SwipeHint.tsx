import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function SwipeHint() {
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // fade in
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      // swipe right
      Animated.timing(translateX, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 150,
        duration: 200,
        useNativeDriver: true,
      }),
      // move back + fade out
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateX }],
        opacity: fadeAnim,
        pointerEvents: "none",
      }}
    >
      <FontAwesome6 name="hand" size={50} color="black" />
    </Animated.View>
  );
}
